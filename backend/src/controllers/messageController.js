import asyncHandler from "express-async-handler";
import { z } from "zod";
import Interest from "../models/Interest.js";
import Message from "../models/Message.js";

const assertParticipant = (interest, userId) => {
  const isParticipant =
    String(interest.organizer) === String(userId) || String(interest.sponsor) === String(userId);
  if (!isParticipant) {
    const err = new Error("You don't have access to this conversation");
    err.statusCode = 403;
    throw err;
  }
};

// GET /api/interests/:id/messages
export const getMessages = asyncHandler(async (req, res) => {
  const interest = await Interest.findById(req.params.id);
  if (!interest) {
    res.status(404);
    throw new Error("Conversation not found");
  }
  assertParticipant(interest, req.user._id);

  const messages = await Message.find({ interest: interest._id })
    .sort({ createdAt: 1 })
    .populate("sender", "name role")
    .lean();

  res.json({ success: true, count: messages.length, messages });
});

const sendSchema = z.object({ text: z.string().trim().min(1).max(4000) });

// POST /api/interests/:id/messages
// Used as a REST fallback; the socket handler performs the same logic
// for live delivery. Kept here so chat still works if sockets are down.
export const sendMessage = asyncHandler(async (req, res) => {
  const parsed = sendSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400);
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  const interest = await Interest.findById(req.params.id);
  if (!interest) {
    res.status(404);
    throw new Error("Conversation not found");
  }
  assertParticipant(interest, req.user._id);

  const message = await Message.create({
    interest: interest._id,
    sender: req.user._id,
    text: parsed.data.text,
  });
  interest.lastMessageAt = new Date();
  await interest.save();

  const populated = await message.populate("sender", "name role");

  // Push to anyone connected via socket to this conversation room too
  req.app.get("io")?.to(`interest_${interest._id}`).emit("new_message", populated);

  res.status(201).json({ success: true, message: populated });
});
