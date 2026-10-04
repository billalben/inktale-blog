import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
  image: string,
  publicId: string,
): Promise<string> {
  try {
    const response = await cloudinary.uploader.upload(image, {
      resource_type: "auto",
      public_id: publicId,
    });
    return response.secure_url;
  } catch (error) {
    throw error;
  }
}

export async function deleteFromCloudinary(publicId = ""): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw error;
  }
}
