import fs from "fs";
import path from "path";
import Video from "../models/Video.js";
import { isMediaToolingAvailable, probeVideoMetadata, transcodeForStreaming } from "./mediaService.js";
import { emitVideoProgress } from "./socketService.js";
import { buildPublicVideoUrl, resolveProcessedOutput } from "./storageService.js";

const detectSensitivity = (video, metadata = {}) => {
  const suspectWords = ["violence", "blood", "weapon", "adult", "nsfw"];
  const sample = `${video.title} ${video.description} ${video.category}`.toLowerCase();
  const dimensionRisk = metadata.width >= 1920 && metadata.height >= 1080;
  return suspectWords.some((word) => sample.includes(word)) ? "flagged" : "safe";
};

const emitProgress = (io, video, payload) => {
  emitVideoProgress(io, video.ownerId, {
    videoId: String(video._id),
    ...payload
  });
};

const updateVideoState = (videoId, payload) =>
  Video.findByIdAndUpdate(videoId, payload, { new: true });

export const queueVideoProcessing = async ({ io, video }) => {
  try {
    await updateVideoState(video._id, {
      progress: 15,
      status: "processing",
      analysisNotes: "Validating uploaded video"
    });
    emitProgress(io, video, { progress: 15, status: "processing", sensitivity: "pending" });

    const toolingAvailable = await isMediaToolingAvailable();

    if (!toolingAvailable) {
      await updateVideoState(video._id, {
        progress: 35,
        analysisNotes: "FFmpeg unavailable, using fallback processing"
      });
      emitProgress(io, video, { progress: 35, status: "processing", sensitivity: "pending" });

      const updatedVideo = await updateVideoState(video._id, {
        progress: 100,
        status: "ready",
        sensitivity: detectSensitivity(video),
        analysisNotes: `Fallback automated review completed for ${path.basename(video.originalFileName)}`,
        streamUrl: buildPublicVideoUrl(video._id)
      });

      emitProgress(io, video, {
        progress: 100,
        status: "ready",
        sensitivity: updatedVideo.sensitivity
      });
      return;
    }

    const originalMetadata = await probeVideoMetadata(video.uploadPath);
    await updateVideoState(video._id, {
      progress: 35,
      width: originalMetadata.width,
      height: originalMetadata.height,
      durationSeconds: originalMetadata.durationSeconds || video.durationSeconds,
      bitrateKbps: originalMetadata.bitrateKbps,
      analysisNotes: "Metadata extracted, preparing streaming output"
    });
    emitProgress(io, video, { progress: 35, status: "processing", sensitivity: "pending" });

    const { processedFileName, processedPath } = resolveProcessedOutput(video.storedFileName);
    const processedMetadata = await transcodeForStreaming({
      inputPath: video.uploadPath,
      outputPath: processedPath
    });

    const stat = fs.statSync(processedPath);
    const sensitivity = detectSensitivity(video, processedMetadata);
    const updatedVideo = await updateVideoState(video._id, {
      progress: 100,
      status: "ready",
      sensitivity,
      processedFileName,
      processedPath,
      durationSeconds: processedMetadata.durationSeconds || originalMetadata.durationSeconds,
      width: processedMetadata.width || originalMetadata.width,
      height: processedMetadata.height || originalMetadata.height,
      bitrateKbps: processedMetadata.bitrateKbps || originalMetadata.bitrateKbps,
      sizeInBytes: stat.size,
      mimeType: "video/mp4",
      analysisNotes: `FFmpeg processing completed and streaming asset prepared for ${path.basename(video.originalFileName)}`,
      streamUrl: buildPublicVideoUrl(video._id)
    });

    emitProgress(io, video, {
      progress: 100,
      status: "ready",
      sensitivity: updatedVideo.sensitivity
    });
  } catch (error) {
    console.error("Video processing failed", error);
    await updateVideoState(video._id, {
      progress: 100,
      status: "failed",
      sensitivity: "pending",
      analysisNotes: `Processing failed: ${error.message}`
    });
    emitProgress(io, video, {
      progress: 100,
      status: "failed",
      sensitivity: "pending"
    });
  }
};
