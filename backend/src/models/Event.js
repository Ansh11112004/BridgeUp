import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 160 },
    college: { type: String, required: true, trim: true, maxlength: 160 },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    date: { type: String, required: true, trim: true, maxlength: 80 }, // display string e.g. "Apr 15–17, 2026"
    attendees: { type: String, trim: true, maxlength: 40, default: "" }, // display string e.g. "15,000+"
    category: {
      type: String,
      enum: ["Tech", "Cultural", "Business", "Sports", "Other"],
      default: "Other",
    },
    budget: { type: String, trim: true, maxlength: 60, default: "" }, // display string e.g. "₹2L – ₹10L"
    description: { type: String, trim: true, maxlength: 2000, default: "" },
    images: { type: [String], default: [] },
    stallTypes: { type: [String], default: [] },
    sponsorsRequired: { type: [String], default: [] },
    highlights: { type: [String], default: [] },
    status: { type: String, enum: ["Live", "Draft", "Closed"], default: "Live" },
  },
  { timestamps: true }
);

eventSchema.index({ name: "text", college: "text", description: "text" });

export default mongoose.model("Event", eventSchema);
