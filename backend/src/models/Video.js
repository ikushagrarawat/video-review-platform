import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    category: {
      type: String,
      default: "general"
    },
    status: {
      type: String,
      enum: ["uploaded", "processing", "ready", "failed"],
      default: "uploaded"
    },
    sensitivity: {
      type: String,
      enum: ["pending", "safe", "flagged"],
      default: "pending"
    },
    progress: {
      type: Number,
      default: 0
    },
    uploadPath: {
      type: String,
      required: true
    },
    storedFileName: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    sizeInBytes: {
      type: Number,
      required: true
    },
    durationSeconds: {
      type: Number,
      default: 0
    },
    originalFileName: {
      type: String,
      required: true
    },
    organizationId: {
      type: String,
      required: true,
      index: true
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    analysisNotes: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
