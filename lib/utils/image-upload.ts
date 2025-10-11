import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from "cloudinary";
import { imageConfig } from "@/config";

// Configure Cloudinary
cloudinary.config({
  cloud_name: imageConfig.cloudName,
  api_key: imageConfig.apiKey,
  api_secret: imageConfig.apiSecret,
});

/**
 * Uploads an image to Cloudinary from base64 data
 * @param base64Data - Base64 string of the image (with data:image/... prefix)
 * @param folder - Optional folder name for organization
 * @returns Promise<string> - The secure URL of the uploaded image
 */
export const uploadImageFromBase64 = async (
  base64Data: string,
  folder?: string
): Promise<string> => {
  try {
    const uploadOptions: UploadApiOptions = {
      resource_type: "image",
      quality: "auto",
      fetch_format: "auto",
    };

    if (folder) {
      uploadOptions.folder = folder;
    }

    const uploadResult = await cloudinary.uploader.upload(
      base64Data,
      uploadOptions
    );

    return uploadResult.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image to cloud storage");
  }
};

/**
 * Uploads an image to Cloudinary from buffer
 * @param buffer - Image buffer
 * @param folder - Optional folder name for organization
 * @returns Promise<string> - The secure URL of the uploaded image
 */
export const uploadImageFromBuffer = async (
  buffer: Buffer,
  folder?: string
): Promise<string> => {
  try {
    const uploadOptions: UploadApiOptions = {
      resource_type: "image",
      quality: "auto",
      fetch_format: "auto",
    };

    if (folder) {
      uploadOptions.folder = folder;
    }

    const uploadResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(uploadOptions, (error, result) => {
            if (error) reject(error);
            else if (result) resolve(result);
            else reject(new Error("Upload failed without error"));
          })
          .end(buffer);
      }
    );

    return uploadResult.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image to cloud storage");
  }
};
