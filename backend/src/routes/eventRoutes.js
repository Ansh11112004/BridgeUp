import { Router } from "express";
import {
  getEvents,
  getMyEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

router.get("/", getEvents);
router.get("/mine", protect, restrictTo("organizer"), getMyEvents);
router.get("/:id", getEventById);
router.post("/", protect, restrictTo("organizer"), createEvent);
router.patch("/:id", protect, restrictTo("organizer"), updateEvent);
router.delete("/:id", protect, restrictTo("organizer"), deleteEvent);

export default router;
