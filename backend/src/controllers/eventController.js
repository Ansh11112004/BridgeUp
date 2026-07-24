import asyncHandler from "express-async-handler";
import { z } from "zod";
import Event from "../models/Event.js";

const eventSchema = z.object({
  name: z.string().trim().min(1).max(160),
  college: z.string().trim().min(1).max(160),
  location: z.string().trim().min(1).max(120),
  date: z.string().trim().min(1).max(80),
  attendees: z.string().trim().max(40).optional().default(""),
  category: z.enum(["Tech", "Cultural", "Business", "Sports", "Other"]).optional().default("Other"),
  budget: z.string().trim().max(60).optional().default(""),
  description: z.string().trim().max(2000).optional().default(""),
  images: z.array(z.string().url()).max(10).optional().default([]),
  stallTypes: z.array(z.string().trim().max(60)).max(20).optional().default([]),
  sponsorsRequired: z.array(z.string().trim().max(60)).max(20).optional().default([]),
  highlights: z.array(z.string().trim().max(60)).max(20).optional().default([]),
});

// GET /api/events?search=&category=&location=
export const getEvents = asyncHandler(async (req, res) => {
  const { search, category, location } = req.query;
  const filter = { status: "Live" };

  if (category && category !== "All") filter.category = category;
  if (location) filter.location = { $regex: location, $options: "i" };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { college: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const events = await Event.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ success: true, count: events.length, events });
});

// GET /api/events/mine  (organizer's own events, any status)
export const getMyEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 }).lean();
  res.json({ success: true, count: events.length, events });
});

// GET /api/events/:id
export const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate("organizer", "name org email").lean();
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  res.json({ success: true, event });
});

// POST /api/events  (organizer only)
export const createEvent = asyncHandler(async (req, res) => {
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400);
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  const event = await Event.create({ ...parsed.data, organizer: req.user._id });
  res.status(201).json({ success: true, event });
});

// PATCH /api/events/:id  (owning organizer only)
export const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  if (String(event.organizer) !== String(req.user._id)) {
    res.status(403);
    throw new Error("You can only edit your own events");
  }

  const parsed = eventSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400);
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  Object.assign(event, parsed.data);
  await event.save();
  res.json({ success: true, event });
});

// DELETE /api/events/:id (owning organizer only)
export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  if (String(event.organizer) !== String(req.user._id)) {
    res.status(403);
    throw new Error("You can only delete your own events");
  }
  await event.deleteOne();
  res.json({ success: true, message: "Event deleted" });
});
