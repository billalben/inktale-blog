"use strict";

const User = require("../models/user_model");
const Blog = require("../models/blog_model");

const getPagination = require("../utils/get_pagination-util");

/**
 * Retrieves profile information and renders the profile page.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @throws {Error} - Throws error if there is an error.
 */
const renderProfile = async (req, res) => {
  try {
    // Extract the username from the request parameters
    const { username } = req.params;

    // Handle case where user is not exists
    const userExists = await User.exists({ username });
    if (!userExists) return res.render("./pages/404");

    // Find the profile of the user
    const profile = await User.findOne({ username }).select(
      "profilePhoto username name bio blogs blogPublished createdAt"
    );

    // Generate pagination data
    const pagination = getPagination(
      `/profile/${username}/`,
      req.params,
      8,
      profile.blogs.length
    );

    // Retrieve profile blogs based on pagination and other criteria
    const profileBlogs = await Blog.find({ _id: { $in: profile.blogs } })
      .select("title createdAt reaction totalBookmark readingTime")
      .populate({
        path: "owner",
        select: "name username profilePhoto",
      })
      .sort({ createdAt: -1 })
      .limit(pagination.limit)
      .skip(pagination.skip);

    // Render profile page with retrieved data
    res.render("./pages/profile", {
      sessionUser: req.session.user,
      profile,
      profileBlogs,
      pagination,
    });
  } catch (error) {
    console.error("Error Rendering profile", error.message);
    throw error;
  }
};

module.exports = renderProfile;
