import mongoose from "mongoose";

// An Interest represents one organizer<->sponsor conversation thread
// anchored to a specific event. It doubles as the "pipeline" object
// shown in both dashboards (New / In Talks / Confirmed) and as the
// chat conversation the Message model attaches to.
const interestSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sponsor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    initiatedBy: { type: String, enum: ["organizer", "sponsor"], required: true },
    message: { type: String, trim: true, maxlength: 1000, default: "" },
    amount: { type: String, trim: true, maxlength: 60, default: "" },
    status: { type: String, enum: ["new", "in-talks", "confirmed"], default: "new" },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// One thread per (event, sponsor) pair
interestSchema.index({ event: 1, sponsor: 1 }, { unique: true });

export default mongoose.model("Interest", interestSchema);
