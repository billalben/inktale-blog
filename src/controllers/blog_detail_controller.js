"use strict";

const mongoose = require("mongoose");

const Blog = require("../models/blog_model");

/**
 * Retrieve and render the blog detail page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} - Throws error if there is an issue with the database
 */

const renderBlogDetail = async (req, res) => {
  try {
    const { blogId } = req.params;

    // Handle case where the provided blogId is not a valid Mongoose ObjectId
    const isValidObjectId = mongoose.Types.ObjectId.isValid(blogId);
    if (!isValidObjectId) return res.render("./pages/404");

    // Handle case where no blog found with the provided blogId
    const blogExist = await Blog.exists({
      _id: new mongoose.Types.ObjectId(blogId),
    });
    if (!blogExist) return res.render("./pages/404");

    // Retrieve the blog detail and populate owner information
    const blog = await Blog.findById(blogId).populate({
      path: "owner",
      select: "name username profilePhoto",
    });

    // Retrieve more blogs by the same author
    const ownerBlogs = await Blog.find({
      owner: { _id: blog.owner._id },
    })
      .select("title reaction totalBookmark owner readingTime createdAt")
      .populate({
        path: "owner",
        select: "name username profilePhoto",
      })
      .where("_id")
      .nin(blogId)
      .sort({ createdAt: "desc" })
      .limit(3);

    res.render("./pages/blog_detail", {
      sessionUser: req.session.user,
      blog,
      ownerBlogs,
    });

  } catch (error) {
    console.error("Error rendering blog detail page: ", error.message);
    throw error;
  }
};

module.exports = renderBlogDetail;
