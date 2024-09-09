"use strict";

const Blog = require("../models/blog_model");
const uploadToCloudinary = require("../config/cloudinary_config");

/**
 * Retrieves a blog from the database and renders a page for updating it.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @throws {Error} - Throws an error if the blog is not found.
 */
const renderBlogEdit = async (req, res) => {
  try {
    // Get blogId from the request parameters
    const { blogId } = req.params;

    // Retrieve logged client username from the session
    const { username } = req.session.user;

    // Find the blog user want to edit by it's id
    const currentBlog = await Blog.findById(blogId)
      .select("banner title content owner")
      .populate({
        path: "owner",
        select: "username",
      });

    // Handle case where current user try to edit other user's blog
    if (currentBlog.owner.username !== username) {
      return res
        .status(403)
        .send(`<h2>Sorry, you are not authorized to edit this blog.</h2>`);
    }

    // Render the blog edit page
    res.render("./pages/blog_update", {
      sessionUser: req.session.user,
      currentBlog,
    });
  } catch (error) {
    console.error("Error rendering blog edit page: ", error?.message);
    throw error;
  }
};

/**
 * Updates a blog in the database.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @throws {Error} - Throws an error if the blog is not found.
 */
const updateBlog = async (req, res) => {
  try {
    // Retrieve blogId from the request parameters
    const { blogId } = req.params;

    // Retrieve blog title, content and banner from the request body
    const { title, content, banner } = req.body;

    // Find the blog user want to update by it's id
    const updatedBlog = await Blog.findById(blogId).select(
      "banner title content"
    );

    // Handle case where banner is exist in the request body
    if (banner) {
      // Upload the new banner to Cloudinary
      const bannerURL = await uploadToCloudinary(
        banner,
        updatedBlog.banner.public_id
      );

      // Update the blog banner
      updatedBlog.banner.url = bannerURL;
    }

    // Update the blog title and content
    updatedBlog.title = title;
    updatedBlog.content = content;

    // Save the updated blog
    await updatedBlog.save();

    // Send a success response
    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating blog: ", error?.message);
    throw error;
  }
};

module.exports = { renderBlogEdit, updateBlog };
