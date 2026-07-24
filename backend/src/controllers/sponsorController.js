import asyncHandler from "express-async-handler";
import { z } from "zod";
import SponsorProfile from "../models/SponsorProfile.js";

const profileSchema = z.object({
  name: z.string().trim().min(1).max(160),
  category: z.string().trim().max(80).optional().default("Other"),
  location: z.string().trim().max(120).optional().default(""),
  budget: z.string().trim().max(60).optional().default(""),
  description: z.string().trim().max(2000).optional().default(""),
  interests: z.array(z.string().trim().max(60)).max(20).optional().default([]),
  images: z.array(z.string().url()).max(10).optional().default([]),
});

// GET /api/sponsors?search=&category=&location=
export const getSponsors = asyncHandler(async (req, res) => {
  const { search, category, location } = req.query;
  const filter = {};

  if (category && category !== "All") filter.category = category;
  if (location) filter.location = { $regex: location, $options: "i" };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const sponsors = await SponsorProfile.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ success: true, count: sponsors.length, sponsors });
});

// GET /api/sponsors/me
export const getMySponsorProfile = asyncHandler(async (req, res) => {
  const profile = await SponsorProfile.findOne({ user: req.user._id }).lean();
  res.json({ success: true, profile: profile || null });
});

// GET /api/sponsors/:id
export const getSponsorById = asyncHandler(async (req, res) => {
  const sponsor = await SponsorProfile.findById(req.params.id).populate("user", "name email").lean();
  if (!sponsor) {
    res.status(404);
    throw new Error("Sponsor not found");
  }
  res.json({ success: true, sponsor });
});

// POST /api/sponsors  (sponsor only — creates or updates their own profile)
export const upsertSponsorProfile = asyncHandler(async (req, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400);
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  const profile = await SponsorProfile.findOneAndUpdate(
    { user: req.user._id },
    { ...parsed.data, user: req.user._id },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.status(200).json({ success: true, profile });
});
