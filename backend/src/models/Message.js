import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    interest: { type: mongoose.Schema.Types.ObjectId, ref: "Interest", required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 4000 },
  },
  { timestamps: true }
);

messageSchema.index({ interest: 1, createdAt: 1 });

export default mongoose.model("Message", messageSchema);
