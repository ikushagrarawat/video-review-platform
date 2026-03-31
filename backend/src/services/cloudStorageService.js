import fs from "fs";
import path from "path";
import { PutObjectCommand, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "../config/env.js";

const normalizeBaseUrl = (value) => value.replace(/\/$/, "");

const s3Client = env.awsAccessKeyId && env.awsSecretAccessKey && env.awsRegion
  ? new S3Client({
      region: env.awsRegion,
      credentials: {
        accessKeyId: env.awsAccessKeyId,
        secretAccessKey: env.awsSecretAccessKey
      }
    })
  : null;

export const isCloudStorageConfigured = () =>
  Boolean(s3Client && env.s3BucketName && env.cdnBaseUrl);

export const buildObjectKey = ({ type, fileName }) => {
  const folder = type === "processed" ? "videos/processed" : "videos/originals";
  return `${folder}/${path.basename(fileName)}`;
};

export const buildCloudFrontUrl = (objectKey) =>
  `${normalizeBaseUrl(env.cdnBaseUrl)}/${objectKey}`;

export const uploadFileToCloud = async ({ filePath, objectKey, contentType }) => {
  if (!isCloudStorageConfigured()) {
    return null;
  }

  const body = fs.readFileSync(filePath);
  await s3Client.send(
    new PutObjectCommand({
      Bucket: env.s3BucketName,
      Key: objectKey,
      Body: body,
      ContentType: contentType
    })
  );

  return buildCloudFrontUrl(objectKey);
};

export const deleteCloudObject = async (objectKey) => {
  if (!isCloudStorageConfigured() || !objectKey) {
    return;
  }

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: env.s3BucketName,
      Key: objectKey
    })
  );
};
