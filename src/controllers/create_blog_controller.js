"use strict";

const crypto = require("crypto");

const { uploadToCloudinary } = require("../config/cloudinary_config");

const User = require("../models/user_model");
const Blog = require("../models/blog_model");

const getReadingTime = require("../utils/get_reading_time");

const imageConfig = require("../config/image_config");

/**
 * Render the create blog page
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const renderCreateBlog = (req, res) => {
  res.render("./pages/create_blog", {
    sessionUser: req.session.user,
    route: req.originalUrl,
  });
};

const postCreateBlog = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    // Handle the uploaded file from multer
    const bannerFile = req.file;

    if (!bannerFile) {
      return res.status(400).json({ message: "Banner image is required." });
    }

    // Check if the banner image is larger than 3MB
    if (bannerFile.size > imageConfig.blogBanner.maxByteSize) {
      return res.status(400).json({
        message: "Banner image should be less than 3 MB.",
      });
    }

    // Upload blog banner to Cloudinary
    const public_id = crypto.randomBytes(10).toString("hex");

    const bannerURL = await uploadToCloudinary(bannerFile.path, public_id);

    // Find The user who created the blog
    const user = await User.findOne({
      username: req.session.user.username,
    }).select("_id blogs blogPublished");

    // Create a new blog in the database
    const newBlog = await Blog.create({
      banner: { url: bannerURL, public_id },
      title,
      content,
      owner: user._id,
      readingTime: getReadingTime(content),
    });

    // Update the user's blog data
    user.blogs.push(newBlog._id);
    user.blogPublished += 1;
    await user.save();

    // Redirect to the newly created blog post page
    res.redirect(`/blogs/${newBlog._id}`);
  } catch (error) {
    // Pass the error to Express error handler middleware
    next(error);
  }
};

module.exports = { renderCreateBlog, postCreateBlog };
