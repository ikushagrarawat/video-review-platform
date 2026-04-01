import fs from "fs";
import path from "path";
import Category from "../models/Category.js";
import Video from "../models/Video.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { httpError } from "../utils/httpError.js";
import { io } from "../app.js";
import { queueVideoProcessing } from "../services/videoProcessingService.js";
import { buildPublicVideoUrl } from "../services/storageService.js";
import {
  buildCloudFrontUrl,
  buildObjectKey,
  deleteCloudObject,
  isCloudStorageConfigured,
  uploadFileToCloud
} from "../services/cloudStorageService.js";

const buildVideoFilter = (req) => {
  const filter = { organizationId: req.user.organizationId };

  if (req.user.role === "viewer") {
    filter.ownerId = req.user._id;
  }

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.sensitivity) {
    filter.sensitivity = req.query.sensitivity;
  }

  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } },
      { category: { $regex: req.query.search, $options: "i" } }
    ];
  }

  if (req.query.minSize || req.query.maxSize) {
    filter.sizeInBytes = {};
    if (req.query.minSize) {
      filter.sizeInBytes.$gte = Number(req.query.minSize);
    }
    if (req.query.maxSize) {
      filter.sizeInBytes.$lte = Number(req.query.maxSize);
    }
  }

  if (req.query.minDuration || req.query.maxDuration) {
    filter.durationSeconds = {};
    if (req.query.minDuration) {
      filter.durationSeconds.$gte = Number(req.query.minDuration);
    }
    if (req.query.maxDuration) {
      filter.durationSeconds.$lte = Number(req.query.maxDuration);
    }
  }

  if (req.query.dateFrom || req.query.dateTo) {
    filter.createdAt = {};
    if (req.query.dateFrom) {
      filter.createdAt.$gte = new Date(req.query.dateFrom);
    }
    if (req.query.dateTo) {
      const endDate = new Date(req.query.dateTo);
      endDate.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = endDate;
    }
  }

  return filter;
};

export const uploadVideo = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw httpError("Video file is required", 400);
  }

  let originalObjectKey = "";
  let streamUrl = "";
  let storageProvider = "local";

  if (isCloudStorageConfigured()) {
    originalObjectKey = buildObjectKey({
      type: "original",
      fileName: req.file.filename
    });
    await uploadFileToCloud({
      filePath: req.file.path,
      objectKey: originalObjectKey,
      contentType: req.file.mimetype
    });
    storageProvider = "s3";
    streamUrl = buildCloudFrontUrl(originalObjectKey);
  }

  const video = await Video.create({
    title: req.body.title || req.file.originalname,
    description: req.body.description || "",
    category: req.body.category || "general",
    uploadPath: req.file.path,
    storedFileName: req.file.filename,
    mimeType: req.file.mimetype,
    sizeInBytes: req.file.size,
    durationSeconds: Number(req.body.durationSeconds || 0),
    originalFileName: req.file.originalname,
    originalObjectKey,
    storageProvider,
    streamUrl,
    organizationId: req.user.organizationId,
    ownerId: req.user._id,
    status: "processing",
    progress: 5
  });

  queueVideoProcessing({ io, video });

  res.status(201).json({ video });
});

export const listVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find(buildVideoFilter(req))
    .populate("ownerId", "name email role")
    .sort({ createdAt: -1 });

  res.json({
    videos: videos.map((video) => ({
      ...video.toObject(),
      streamUrl: video.streamUrl || buildPublicVideoUrl(video._id)
    }))
  });
});

export const listCategories = asyncHandler(async (req, res) => {
  const [storedCategories, videoCategories] = await Promise.all([
    Category.find({ organizationId: req.user.organizationId }).sort({ name: 1 }),
    Video.distinct("category", buildVideoFilter(req))
  ]);

  const merged = new Map();

  for (const category of storedCategories) {
    merged.set(category.name, {
      id: category._id,
      name: category.name,
      source: "managed"
    });
  }

  for (const categoryName of videoCategories.filter(Boolean)) {
    if (!merged.has(categoryName)) {
      merged.set(categoryName, {
        id: categoryName,
        name: categoryName,
        source: "from-videos"
      });
    }
  }

  res.json({ categories: [...merged.values()] });
});

export const getVideoById = asyncHandler(async (req, res) => {
  const video = await Video.findOne({
    _id: req.params.videoId,
    organizationId: req.user.organizationId
  }).populate("ownerId", "name email role");

  if (!video) {
    throw httpError("Video not found", 404);
  }

  if (req.user.role === "viewer" && String(video.ownerId._id) !== String(req.user._id)) {
    throw httpError("You do not have access to this video", 403);
  }

  res.json({ video });
});

export const deleteVideo = asyncHandler(async (req, res) => {
  const video = await Video.findOne({
    _id: req.params.videoId,
    organizationId: req.user.organizationId
  });

  if (!video) {
    throw httpError("Video not found", 404);
  }

  const canDelete =
    req.user.role === "admin" ||
    String(video.ownerId) === String(req.user._id);

  if (!canDelete) {
    throw httpError("You do not have permission to delete this video", 403);
  }

  for (const filePath of [video.processedPath, video.uploadPath]) {
    if (!filePath) {
      continue;
    }

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.warn("Unable to delete file during video cleanup", filePath, error.message);
    }
  }

  await Promise.all([
    deleteCloudObject(video.originalObjectKey),
    deleteCloudObject(video.processedObjectKey)
  ]);

  await Video.deleteOne({ _id: video._id });

  res.json({ message: "Video deleted" });
});

export const reprocessVideo = asyncHandler(async (req, res) => {
  const video = await Video.findOne({
    _id: req.params.videoId,
    organizationId: req.user.organizationId
  });

  if (!video) {
    throw httpError("Video not found", 404);
  }

  const canReprocess =
    req.user.role === "admin" ||
    String(video.ownerId) === String(req.user._id);

  if (!canReprocess) {
    throw httpError("You do not have permission to reprocess this video", 403);
  }

  if (video.processedPath && fs.existsSync(video.processedPath)) {
    try {
      fs.unlinkSync(video.processedPath);
    } catch (error) {
      console.warn("Unable to remove old processed asset", error.message);
    }
  }

  const previousProcessedObjectKey = video.processedObjectKey;

  video.status = "processing";
  video.progress = 5;
  video.sensitivity = "pending";
  video.analysisNotes = "Reprocessing requested";
  video.processedPath = "";
  video.processedFileName = "";
  video.processedObjectKey = "";
  video.streamUrl = video.originalObjectKey
    ? buildCloudFrontUrl(video.originalObjectKey)
    : "";
  await deleteCloudObject(previousProcessedObjectKey);
  await video.save();

  queueVideoProcessing({ io, video });

  res.json({ video });
});

export const streamVideo = asyncHandler(async (req, res) => {
  const video = await Video.findOne({
    _id: req.params.videoId,
    organizationId: req.user.organizationId
  });

  if (!video) {
    throw httpError("Video not found", 404);
  }

  if (req.user.role === "viewer" && String(video.ownerId) !== String(req.user._id)) {
    throw httpError("You do not have access to this stream", 403);
  }

  if (video.streamUrl && /^https?:\/\//.test(video.streamUrl)) {
    res.redirect(302, video.streamUrl);
    return;
  }

  const filePath = path.resolve(video.processedPath || video.uploadPath);
  if (!fs.existsSync(filePath)) {
    throw httpError("Video file is unavailable on this environment", 404);
  }
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (!range) {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": video.mimeType,
      "Cache-Control": "public, max-age=3600",
      ETag: `"${video._id}-${fileSize}"`
    });
    const stream = fs.createReadStream(filePath);
    stream.on("error", (error) => {
      console.error("Streaming failed", error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Unable to stream video" });
      } else {
        res.destroy(error);
      }
    });
    stream.pipe(res);
    return;
  }

  const [startString, endString] = range.replace(/bytes=/, "").split("-");
  const start = Number(startString);
  const end = endString ? Number(endString) : fileSize - 1;
  const chunkSize = end - start + 1;

  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunkSize,
    "Content-Type": video.mimeType,
    "Cache-Control": "public, max-age=3600",
    ETag: `"${video._id}-${fileSize}"`
  });

  const stream = fs.createReadStream(filePath, { start, end });
  stream.on("error", (error) => {
    console.error("Range streaming failed", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Unable to stream video range" });
    } else {
      res.destroy(error);
    }
  });
  stream.pipe(res);
});
