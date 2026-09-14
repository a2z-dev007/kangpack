import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { env } from "../../config/env";
import { AppError } from "../middlewares/error.middleware";
import { HTTP_STATUS } from "../constants";

export class R2Service {
  private static client: S3Client | null = null;

  /**
   * Check if Cloudflare R2 credentials are configured
   */
  public static isConfigured(): boolean {
    return Boolean(
      env.R2_ACCOUNT_ID &&
      env.R2_ACCESS_KEY_ID &&
      env.R2_SECRET_ACCESS_KEY &&
      env.R2_BUCKET_NAME
    );
  }

  /**
   * Lazy-initialized S3Client configured for Cloudflare R2
   */
  private static getClient(): S3Client {
    if (this.client) {
      return this.client;
    }

    if (!this.isConfigured()) {
      throw new AppError(
        "Cloudflare R2 storage is not fully configured. Please set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME in your environment.",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    });

    return this.client;
  }

  /**
   * Upload a file to Cloudflare R2 Object Storage
   * @param file - Multer file object with buffer
   * @param folder - Destination folder (e.g. 'products', 'avatars', 'banners')
   * @returns Public URL of the uploaded object
   */
  public static async uploadFile(file: any, folder: string = "general"): Promise<string> {
    try {
      if (!file) {
        throw new AppError("No file provided for upload", HTTP_STATUS.BAD_REQUEST);
      }

      if (!file.buffer) {
        throw new AppError("File buffer is required for R2 upload", HTTP_STATUS.BAD_REQUEST);
      }

      const client = this.getClient();

      // Clean & sanitize file name
      const ext = path.extname(file.originalname || "") || ".jpg";
      const baseName = (file.originalname || "asset")
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "-")
        .toLowerCase();
      const key = `${folder}/${Date.now()}-${uuidv4().substring(0, 8)}-${baseName}${ext}`;

      const upload = new Upload({
        client,
        params: {
          Bucket: env.R2_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype || "application/octet-stream",
          CacheControl: "public, max-age=31536000, immutable",
        },
      });

      await upload.done();

      // Format public URL
      if (env.R2_PUBLIC_URL) {
        return `${env.R2_PUBLIC_URL}/${key}`;
      }

      // Fallback: If no custom domain / r2.dev domain is provided
      return `https://${env.R2_BUCKET_NAME}.${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;
    } catch (error: any) {
      console.error("Cloudflare R2 Upload Error:", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Failed to upload file to R2: ${error.message}`, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Upload multiple files to Cloudflare R2 concurrently
   * @param files - Array of Multer file objects
   * @param folder - Destination folder
   * @returns Array of public object URLs
   */
  public static async uploadMultiple(files: any[], folder: string = "general"): Promise<string[]> {
    if (!files || !Array.isArray(files) || files.length === 0) return [];
    const uploadPromises = files.map(file => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

  /**
   * Delete an object from Cloudflare R2
   * @param fileUrlOrKey - Full public URL or object key
   */
  public static async deleteFile(fileUrlOrKey: string): Promise<void> {
    try {
      if (!fileUrlOrKey || typeof fileUrlOrKey !== "string") return;

      if (!this.isConfigured()) {
        console.warn("Cloudflare R2 is not configured; skipping file deletion.");
        return;
      }

      const client = this.getClient();

      // Extract object key from URL or use as-is
      let key = fileUrlOrKey;
      if (fileUrlOrKey.startsWith("http://") || fileUrlOrKey.startsWith("https://")) {
        try {
          const parsed = new URL(fileUrlOrKey);
          key = parsed.pathname.replace(/^\/+/, "");
        } catch {
          // If URL parsing fails, extract everything after domain
          key = fileUrlOrKey.replace(/^https?:\/\/[^/]+\//, "");
        }
      }

      const command = new DeleteObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
      });

      await client.send(command);
      console.log(`✓ Deleted object from Cloudflare R2: ${key}`);
    } catch (error: any) {
      console.warn(`⚠️ Cloudflare R2 delete failed for '${fileUrlOrKey}':`, error.message);
      // Non-blocking: Do not throw error so caller can finish main transaction
    }
  }
}
