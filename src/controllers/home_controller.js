"use strict";

const Blog = require("../models/blog_model");
const getPagination = require("../utils/get_pagination-util");

/**
 * Controller function to render the home page with blog data.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @throws {Error} - An error if the blog data cannot be retrieved.
 */

const renderHome = async (req, res, next) => {
  try {
    // Retrieve total amount of created blogs in the database
    const totalBlogs = await Blog.countDocuments();

    // Get pagination object
    const pagination = getPagination("/", req.params, 8, totalBlogs);

    // Retrieve blogs from the database, selecting specific fields and populating the author field.
    const latestBlogs = await Blog.find()
      .select(
        "banner author createdAt readingTime title reaction totalBookmark"
      )
      .populate({
        path: "owner",
        select: "name username profilePhoto",
      })
      .sort({ createdAt: "desc" })
      .limit(pagination.limit)
      .skip(pagination.skip);

    res.render("./pages/home", {
      sessionUser: req.session.user,
      latestBlogs,
      pagination,
    });
  } catch (error) {
    // Pass the error to Express error handler middleware
    next(error);
  }
};

module.exports = renderHome;
