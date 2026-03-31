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
    processedPath: {
      type: String,
      default: ""
    },
    storedFileName: {
      type: String,
      required: true
    },
    processedFileName: {
      type: String,
      default: ""
    },
    originalObjectKey: {
      type: String,
      default: ""
    },
    processedObjectKey: {
      type: String,
      default: ""
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
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    bitrateKbps: {
      type: Number,
      default: 0
    },
    streamUrl: {
      type: String,
      default: ""
    },
    storageProvider: {
      type: String,
      enum: ["local", "s3"],
      default: "local"
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
