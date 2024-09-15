"use strict";

// Require the cloudinary library
const cloudinary = require("cloudinary").v2;

// Configures Cloudinary settings for image uploads.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image to Cloudinary.
 * @param {string} image - req.file.path from multer.
 * @param {string} public_id - The identifier that's use for accessing and delivering the uploaded asset.
 * @returns {Promise<string>} - A promise that resolves with the URL of the uploaded image on Cloudinary.
 * @throws {Error} - An error from the Cloudinary API.
 */
const uploadToCloudinary = async (image, public_id) => {
  try {
    const response = await cloudinary.uploader.upload(image, {
      resource_type: "auto",
      public_id,
    });

    return response.secure_url;
  } catch (error) {
    throw error;
  }
};

module.exports = uploadToCloudinary;
