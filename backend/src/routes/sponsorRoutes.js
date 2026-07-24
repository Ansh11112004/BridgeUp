import { Router } from "express";
import {
  getSponsors,
  getMySponsorProfile,
  getSponsorById,
  upsertSponsorProfile,
} from "../controllers/sponsorController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

router.get("/", getSponsors);
router.get("/me", protect, restrictTo("sponsor"), getMySponsorProfile);
router.get("/:id", getSponsorById);
router.post("/", protect, restrictTo("sponsor"), upsertSponsorProfile);

export default router;
