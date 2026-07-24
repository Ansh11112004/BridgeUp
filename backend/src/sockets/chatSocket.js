import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Interest from "../models/Interest.js";
import Message from "../models/Message.js";

const isParticipant = (interest, userId) =>
  String(interest.organizer) === String(userId) || String(interest.sponsor) === String(userId);

export const initChatSocket = (io) => {
  // Authenticate every socket connection using the same JWT the REST API uses
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Not authorized — no token provided"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error("Not authorized — user no longer exists"));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Not authorized — invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    // Join a conversation room. Client must own/participate in the interest.
    socket.on("join_conversation", async (interestId, ack) => {
      try {
        const interest = await Interest.findById(interestId);
        if (!interest || !isParticipant(interest, socket.user._id)) {
          return ack?.({ ok: false, error: "Not authorized for this conversation" });
        }
        socket.join(`interest_${interestId}`);
        ack?.({ ok: true });
      } catch (err) {
        ack?.({ ok: false, error: "Could not join conversation" });
      }
    });

    socket.on("leave_conversation", (interestId) => {
      socket.leave(`interest_${interestId}`);
    });

    // Send a message: persist to Mongo, then broadcast to everyone in the room
    socket.on("send_message", async ({ interestId, text }, ack) => {
      try {
        if (!text || !text.trim()) {
          return ack?.({ ok: false, error: "Message text is required" });
        }
        const interest = await Interest.findById(interestId);
        if (!interest || !isParticipant(interest, socket.user._id)) {
          return ack?.({ ok: false, error: "Not authorized for this conversation" });
        }

        const message = await Message.create({
          interest: interestId,
          sender: socket.user._id,
          text: text.trim().slice(0, 4000),
        });
        interest.lastMessageAt = new Date();
        await interest.save();

        const populated = await message.populate("sender", "name role");

        io.to(`interest_${interestId}`).emit("new_message", populated);
        ack?.({ ok: true, message: populated });
      } catch (err) {
        ack?.({ ok: false, error: "Could not send message" });
      }
    });

    // Lightweight typing indicator
    socket.on("typing", ({ interestId, isTyping }) => {
      socket.to(`interest_${interestId}`).emit("typing", {
        userId: socket.user._id,
        isTyping: Boolean(isTyping),
      });
    });
  });
};
