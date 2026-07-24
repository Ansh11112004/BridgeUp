import mongoose from "mongoose";

const sponsorProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 160 }, // business name
    category: { type: String, trim: true, maxlength: 80, default: "Other" },
    location: { type: String, trim: true, maxlength: 120, default: "" },
    budget: { type: String, trim: true, maxlength: 60, default: "" }, // display string e.g. "₹50K – ₹2L"
    rating: { type: Number, min: 0, max: 5, default: 4.5 },
    description: { type: String, trim: true, maxlength: 2000, default: "" },
    interests: { type: [String], default: [] }, // e.g. ["Cultural Fests", "Tech Events"]
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

sponsorProfileSchema.index({ name: "text", description: "text", category: "text" });

export default mongoose.model("SponsorProfile", sponsorProfileSchema);
