import path from "path";
import Video from "../models/Video.js";
import { emitVideoProgress } from "./socketService.js";

const detectSensitivity = (video) => {
  const suspectWords = ["violence", "blood", "weapon", "adult", "nsfw"];
  const sample = `${video.title} ${video.description}`.toLowerCase();
  return suspectWords.some((word) => sample.includes(word)) ? "flagged" : "safe";
};

export const queueVideoProcessing = ({ io, video }) => {
  const milestones = [15, 35, 60, 85, 100];
  let index = 0;

  const timer = setInterval(async () => {
    const progress = milestones[index];
    const status = progress === 100 ? "ready" : "processing";
    const sensitivity = progress === 100 ? detectSensitivity(video) : "pending";

    const updatedVideo = await Video.findByIdAndUpdate(
      video._id,
      {
        progress,
        status,
        sensitivity,
        analysisNotes:
          progress === 100
            ? `Automated review completed for ${path.basename(video.originalFileName)}`
            : "Automated review in progress"
      },
      { new: true }
    );

    emitVideoProgress(io, video.ownerId, {
      videoId: String(video._id),
      progress,
      status,
      sensitivity: updatedVideo.sensitivity
    });

    index += 1;
    if (index === milestones.length) {
      clearInterval(timer);
    }
  }, 2500);
};
