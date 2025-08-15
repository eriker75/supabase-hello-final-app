import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from "axios";

// S3/Supabase Storage config from env
const SUPABASE_S3_ENDPOINT = process.env.SUPABASE_S3_ENDPOINT;
const SUPABASE_S3_ACCESS_KEY_ID = process.env.SUPABASE_S3_ACCESS_KEY_ID;
const SUPABASE_S3_SECRET_ACCESS_KEY = process.env.SUPABASE_S3_SECRET_ACCESS_KEY;
const SUPABASE_S3_BUCKET_NAME = process.env.SUPABASE_S3_BUCKET_NAME;
const SUPABASE_S3_REGION = process.env.SUPABASE_S3_REGION || "us-east-1";

if (
  !SUPABASE_S3_ENDPOINT ||
  !SUPABASE_S3_ACCESS_KEY_ID ||
  !SUPABASE_S3_SECRET_ACCESS_KEY ||
  !SUPABASE_S3_BUCKET_NAME
) {
  throw new Error("Missing Supabase S3 storage environment variables");
}

const s3Client = new S3Client({
  region: SUPABASE_S3_REGION,
  endpoint: SUPABASE_S3_ENDPOINT,
  credentials: {
    accessKeyId: SUPABASE_S3_ACCESS_KEY_ID,
    secretAccessKey: SUPABASE_S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

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
  const command = new PutObjectCommand({
    Bucket: SUPABASE_S3_BUCKET_NAME,
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
  const command = new GetObjectCommand({
    Bucket: SUPABASE_S3_BUCKET_NAME,
    Key: key,
  });
  return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}

/**
 * Delete a file from Supabase S3 storage.
 * @param key S3 object key
 */
export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: SUPABASE_S3_BUCKET_NAME,
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
