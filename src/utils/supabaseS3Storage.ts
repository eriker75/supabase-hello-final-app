import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from "axios";

// S3/Supabase Storage config from env
function getS3Config() {
  return {
    endpoint: process.env.SUPABASE_S3_ENDPOINT,
    accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY,
    bucket: process.env.SUPABASE_S3_BUCKET_NAME,
    region: process.env.SUPABASE_S3_REGION || "us-east-1",
  };
}

function getS3Client() {
  const {
    endpoint,
    accessKeyId,
    secretAccessKey,
    bucket,
    region,
  } = getS3Config();

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error("Missing Supabase S3 storage environment variables");
  }

  return {
    s3Client: new S3Client({
      region,
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true,
    }),
    bucket,
  };
}

/**
 * Upload a file buffer to Supabase S3 storage.
 * @param buffer File buffer (e.g. from React Native FS or Node)
 * @param key S3 object key (path/filename)
 * @param mimeType MIME type of the file
 * @returns The S3 key of the uploaded file
 */
export async function uploadFile(
  buffer: Buffer,
  key: string,
  mimeType: string
): Promise<string> {
  const { s3Client, bucket } = getS3Client();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  });
  await s3Client.send(command);
  return key;
}

/**
 * Get a signed URL for a file in Supabase S3 storage.
 * @param key S3 object key
 * @param expiresInSeconds Expiration in seconds (default: 1 hour)
 * @returns Signed URL string
 */
export async function getSignedUrlForKey(
  key: string,
  expiresInSeconds = 3600
): Promise<string> {
  const { s3Client, bucket } = getS3Client();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}

/**
 * Delete a file from Supabase S3 storage.
 * @param key S3 object key
 */
export async function deleteFile(key: string): Promise<void> {
  const { s3Client, bucket } = getS3Client();
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  await s3Client.send(command);
}

/**
 * Download an image from a URL to a Buffer.
 * @param url Image URL
 * @returns Buffer with image data
 */
export async function downloadImageToBuffer(url: string): Promise<Buffer> {
  const maxAttempts = 3;
  const timeout = 20000;
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await axios.get(url, { responseType: "arraybuffer", timeout });
      if (res.status !== 200) {
        throw new Error(
          `Failed to download image: ${url} (status: ${res.status})`
        );
      }
      const buffer = Buffer.from(res.data);
      if (!buffer || buffer.length === 0) {
        throw new Error(`Downloaded image is empty: ${url}`);
      }
      return buffer;
    } catch (error) {
      lastError = error;
      let errorMsg = "";
      if (typeof error === "object" && error !== null && "message" in error) {
        errorMsg = (error as any).message;
      } else {
        errorMsg = String(error);
      }
      console.warn(
        `⚠️ Attempt ${attempt} to download image failed: ${url} - ${errorMsg}`
      );
      if (attempt < maxAttempts) {
        await new Promise((res) => setTimeout(res, 1000));
      }
    }
  }
  throw new Error(
    `Failed to download image after ${maxAttempts} attempts: ${url} - ${
      lastError?.message || lastError
    }`
  );
}
