import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    organizationId: {
      type: String,
      required: true,
      index: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

categorySchema.index({ organizationId: 1, name: 1 }, { unique: true });

export default mongoose.model("Category", categorySchema);
