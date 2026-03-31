import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import { env } from "../config/env.js";

const execFileAsync = promisify(execFile);

export const isMediaToolingAvailable = async () => {
  try {
    await execFileAsync(env.ffmpegPath, ["-version"]);
    await execFileAsync(env.ffprobePath, ["-version"]);
    return true;
  } catch (_error) {
    return false;
  }
};

export const probeVideoMetadata = async (filePath) => {
  const { stdout } = await execFileAsync(env.ffprobePath, [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=width,height,bit_rate:format=duration,size",
    "-of",
    "json",
    filePath
  ]);

  const parsed = JSON.parse(stdout);
  const stream = parsed.streams?.[0] || {};
  const format = parsed.format || {};

  return {
    width: Number(stream.width || 0),
    height: Number(stream.height || 0),
    durationSeconds: Math.round(Number(format.duration || 0)),
    bitrateKbps: Math.round(Number(stream.bit_rate || format.bit_rate || 0) / 1000),
    sizeInBytes: Number(format.size || 0)
  };
};

export const transcodeForStreaming = async ({ inputPath, outputPath }) => {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  await execFileAsync(env.ffmpegPath, [
    "-y",
    "-i",
    inputPath,
    "-vf",
    "scale='min(1280,iw)':-2",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "28",
    "-movflags",
    "+faststart",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    outputPath
  ]);

  return probeVideoMetadata(outputPath);
};
