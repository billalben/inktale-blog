"use strict";

const mongoose = require("mongoose");

const Blog = require("../models/blog_model");
const User = require("../models/user_model");
const markdown = require("../config/markdown_it_config");

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

    // Retrieve the session user's reacted blogs and reading list to check if the session user has reacted to the blog or added to reading list.
    let user;
    if (req.session.user) {
      user = await User.findOne({ username: req.session.user.username }).select(
        "reactedBlogs readingList"
      );
    }

    res.render("./pages/blog_detail", {
      sessionUser: req.session.user,
      blog,
      ownerBlogs,
      user,
      markdown,
    });
  } catch (error) {
    console.error("Error rendering blog detail page: ", error.message);
    throw error;
  }
};

module.exports = renderBlogDetail;
