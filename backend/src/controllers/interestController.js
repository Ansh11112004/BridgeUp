import asyncHandler from "express-async-handler";
import { z } from "zod";
import Interest from "../models/Interest.js";
import Message from "../models/Message.js";
import Event from "../models/Event.js";
import User from "../models/User.js";

const createSchema = z.object({
  eventId: z.string().min(1),
  sponsorId: z.string().optional(), // required when an organizer initiates
  message: z.string().trim().max(1000).optional().default(""),
  amount: z.string().trim().max(60).optional().default(""),
});

// POST /api/interests
// Sponsor -> pass eventId, expresses interest in an event.
// Organizer -> pass eventId + sponsorId, reaches out to a sponsor.
export const createInterest = asyncHandler(async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400);
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }
  const { eventId, message, amount } = parsed.data;
  let { sponsorId } = parsed.data;

  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  let organizerId;
  let initiatedBy;

  if (req.user.role === "sponsor") {
    sponsorId = req.user._id;
    organizerId = event.organizer;
    initiatedBy = "sponsor";
  } else {
    if (!sponsorId) {
      res.status(400);
      throw new Error("sponsorId is required when an organizer initiates contact");
    }
    const sponsorUser = await User.findById(sponsorId);
    if (!sponsorUser || sponsorUser.role !== "sponsor") {
      res.status(404);
      throw new Error("Sponsor not found");
    }
    if (String(event.organizer) !== String(req.user._id)) {
      res.status(403);
      throw new Error("You can only reach out to sponsors for your own events");
    }
    organizerId = req.user._id;
    initiatedBy = "organizer";
  }

  let interest = await Interest.findOne({ event: eventId, sponsor: sponsorId });

  if (!interest) {
    interest = await Interest.create({
      event: eventId,
      organizer: organizerId,
      sponsor: sponsorId,
      initiatedBy,
      message,
      amount,
      status: "new",
    });
  }

  if (message) {
    await Message.create({ interest: interest._id, sender: req.user._id, text: message });
    interest.lastMessageAt = new Date();
    await interest.save();
  }

  const populated = await Interest.findById(interest._id)
    .populate("event", "name college date images")
    .populate("organizer", "name org email")
    .populate("sponsor", "name org email");

  res.status(201).json({ success: true, interest: populated });
});

// GET /api/interests/mine — role-aware inbox for the logged-in user
export const getMyInterests = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === "organizer" ? { organizer: req.user._id } : { sponsor: req.user._id };

  const interests = await Interest.find(filter)
    .sort({ lastMessageAt: -1 })
    .populate("event", "name college date images location")
    .populate("organizer", "name org email")
    .populate("sponsor", "name org email")
    .lean();

  res.json({ success: true, count: interests.length, interests });
});

// GET /api/interests/:id
export const getInterestById = asyncHandler(async (req, res) => {
  const interest = await Interest.findById(req.params.id)
    .populate("event", "name college date images location")
    .populate("organizer", "name org email")
    .populate("sponsor", "name org email");

  if (!interest) {
    res.status(404);
    throw new Error("Conversation not found");
  }

  const isParticipant =
    String(interest.organizer._id) === String(req.user._id) ||
    String(interest.sponsor._id) === String(req.user._id);
  if (!isParticipant) {
    res.status(403);
    throw new Error("You don't have access to this conversation");
  }

  res.json({ success: true, interest });
});

// PATCH /api/interests/:id/status
const statusSchema = z.object({ status: z.enum(["new", "in-talks", "confirmed"]) });

export const updateInterestStatus = asyncHandler(async (req, res) => {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400);
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  const interest = await Interest.findById(req.params.id);
  if (!interest) {
    res.status(404);
    throw new Error("Conversation not found");
  }

  const isParticipant =
    String(interest.organizer) === String(req.user._id) ||
    String(interest.sponsor) === String(req.user._id);
  if (!isParticipant) {
    res.status(403);
    throw new Error("You don't have access to this conversation");
  }

  interest.status = parsed.data.status;
  await interest.save();
  res.json({ success: true, interest });
});
