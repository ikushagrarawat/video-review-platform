import path from "path";
import { env } from "../config/env.js";

export const buildPublicVideoUrl = (videoId, token) => {
  if (env.cdnBaseUrl) {
    return `${env.cdnBaseUrl.replace(/\/$/, "")}/${videoId}.mp4`;
  }

  return `/api/videos/${videoId}/stream${token ? `?token=${token}` : ""}`;
};

export const resolveProcessedOutput = (storedFileName) => {
  const baseName = path.parse(storedFileName).name;
  const processedFileName = `${baseName}-processed.mp4`;
  return {
    processedFileName,
    processedPath: path.resolve(env.processedDir, processedFileName)
  };
};
