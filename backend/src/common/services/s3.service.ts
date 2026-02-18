import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { env } from "../../config/env";
import { AppError } from "../middlewares/error.middleware";
import { HTTP_STATUS } from "../constants";

const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export class S3Service {
  /**
   * Upload a file to S3
   * @param file - Multer file object
   * @param folder - Folder in bucket
   * @returns Public URL of the uploaded file
   */
  public static async uploadFile(file: any, folder: string = "general"): Promise<string> {
    try {
      const fileName = `${folder}/${Date.now()}-${file.originalname.replace(/\s/g, "-")}`;
      
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: env.S3_BUCKET_NAME,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
          // Note: public-read requires ACLs to be enabled on the bucket.
          // If using block public access, you might need a different approach (like signed URLs)
          // or a bucket policy that allows public read on the objects.
          // ACL: "public-read", 
        },
      });

      await upload.done();

      // Return the public URL
      return `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${fileName}`;
    } catch (error: any) {
      console.error("S3 Upload Error:", error);
      throw new AppError("Failed to upload file to S3", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Upload multiple files to S3
   * @param files - Array of Multer file objects
   * @param folder - Folder in bucket
   * @returns Array of public URLs
   */
  public static async uploadMultiple(files: any[], folder: string = "general"): Promise<string[]> {
    if (!files || files.length === 0) return [];
    
    const uploadPromises = files.map(file => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

  /**
   * Delete a file from S3
   * @param fileUrl - Full public URL of the file
   */
  public static async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extract key from URL
      // Example URL: https://bucket-name.s3.region.amazonaws.com/folder/filename.jpg
      const urlPattern = new RegExp(`https:\/\/${env.S3_BUCKET_NAME}\.s3\.${env.AWS_REGION}\.amazonaws\.com\/(.+)`);
      const match = fileUrl.match(urlPattern);
      
      if (!match || !match[1]) {
        console.warn("Could not extract S3 key from URL:", fileUrl);
        return;
      }
      
      const key = match[1];

      const command = new DeleteObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
      });

      await s3Client.send(command);
    } catch (error: any) {
      console.error("S3 Delete Error:", error);
      // Don't throw error to avoid breaking main flows if cleanup fails
    }
  }
}
