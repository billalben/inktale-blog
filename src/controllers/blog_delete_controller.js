"use strict";

const Blog = require("../models/blog_model");
const User = require("../models/user_model");

/**
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const deleteBlog = async (req, res) => {
  try {
    // Retrieve blogId from the request parameters
    const { blogId } = req.params;

    // Retrieve username from session
    const { username } = req.session.user;

    // Find the blog to delete it
    const deletedBlog = await Blog.findOne({ _id: blogId }).select(
      "reaction totalVisit"
    );

    // Find the current user by username
    const currentUser = await User.findOne({ username }).select(
      "blogPublished totalVisits totalReactions"
    );

    // Update user information from the database
    currentUser.blogPublished -= 1;
    currentUser.totalVisits -= deletedBlog.totalVisit;
    currentUser.totalReactions -= deletedBlog.reaction;
    currentUser.blogs.splice(currentUser.blogs.indexOf(blogId), 1);
    await currentUser.save();

    // Delete the blog from the database
    await Blog.deleteOne({ _id: blogId });

    // Send a success response
    res.sendStatus(200);
  } catch (error) {
    console.error("Error deleting blog:", error.message);
    throw error;
  }
};

module.exports = deleteBlog;
