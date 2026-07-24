import { Router } from "express";
import {
  createInterest,
  getMyInterests,
  getInterestById,
  updateInterestStatus,
} from "../controllers/interestController.js";
import { getMessages, sendMessage } from "../controllers/messageController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.post("/", createInterest);
router.get("/mine", getMyInterests);
router.get("/:id", getInterestById);
router.patch("/:id/status", updateInterestStatus);

router.get("/:id/messages", getMessages);
router.post("/:id/messages", sendMessage);

export default router;
