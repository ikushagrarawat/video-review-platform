import multer from "multer";
import path from "path";
import { v4 as uuid } from "uuid";
import { env } from "../config/env.js";
import { httpError } from "./httpError.js";

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, path.resolve(env.uploadDir));
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    callback(null, `${uuid()}${extension}`);
  }
});

const fileFilter = (_req, file, callback) => {
  if (!file.mimetype.startsWith("video/")) {
    callback(httpError("Only video uploads are allowed", 400));
    return;
  }

  callback(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 250 * 1024 * 1024
  }
});
