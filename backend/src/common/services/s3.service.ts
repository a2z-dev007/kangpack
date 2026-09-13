import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../middlewares/error.middleware";
import { HTTP_STATUS } from "../constants";

export class S3Service {
  private static getUploadBaseDir(): string {
    const baseDir = path.resolve(process.cwd(), "uploads");
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }
    return baseDir;
  }

  /**
   * Upload a file to the local uploads directory
   * @param file - Multer file object (buffer or disk file)
   * @param folder - Subfolder inside uploads (e.g. 'products', 'avatars')
   * @returns Public relative path of the uploaded file (e.g. '/uploads/products/xyz.jpg')
   */
  public static async uploadFile(file: any, folder: string = "general"): Promise<string> {
    try {
      if (!file) {
        throw new AppError("No file provided", HTTP_STATUS.BAD_REQUEST);
      }

      const targetDir = path.join(this.getUploadBaseDir(), folder);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Generate a clean, unique file name
      const ext = path.extname(file.originalname || "") || ".jpg";
      const sanitizedName = (file.originalname || "file")
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9]/g, "-")
        .toLowerCase();
      const fileName = `${Date.now()}-${uuidv4().substring(0, 8)}-${sanitizedName}${ext}`;
      const filePath = path.join(targetDir, fileName);

      // Save file buffer to local disk
      if (file.buffer) {
        await fs.promises.writeFile(filePath, file.buffer);
      } else if (file.path && fs.existsSync(file.path)) {
        await fs.promises.copyFile(file.path, filePath);
      } else {
        throw new Error("File content is missing buffer or path");
      }

      // Return public URL path accessible via /uploads/...
      return `/uploads/${folder}/${fileName}`;
    } catch (error: any) {
      console.error("Local File Upload Error:", error);
      throw new AppError("Failed to save uploaded file", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Upload multiple files to local storage
   * @param files - Array of Multer file objects
   * @param folder - Folder in uploads
   * @returns Array of public file URLs
   */
  public static async uploadMultiple(files: any[], folder: string = "general"): Promise<string[]> {
    if (!files || files.length === 0) return [];
    const uploadPromises = files.map(file => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

  /**
   * Delete a file from local storage
   * @param fileUrl - File path or URL
   */
  public static async deleteFile(fileUrl: string): Promise<void> {
    try {
      if (!fileUrl) return;

      // Extract relative path after /uploads/
      const cleanPath = fileUrl.includes("/uploads/")
        ? fileUrl.substring(fileUrl.indexOf("/uploads/") + 1)
        : fileUrl.replace(/^\//, "");

      const fullPath = path.resolve(process.cwd(), cleanPath);

      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
        console.log(`✓ Deleted local file: ${cleanPath}`);
      }
    } catch (error: any) {
      console.warn("Could not delete local file:", fileUrl, error.message);
    }
  }
}
