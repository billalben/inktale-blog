"use strict";

const User = require("../models/user_model");
const Blog = require("../models/blog_model");
const req = require("express/lib/request");

const getPagination = require("../utils/get_pagination-util");

/**
 * Add a blog post to the reading list of the logged-in user and update the total bookmark count of the blog.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @throws {Error} - Throws an error if there is any issue during the process.
 */

const addToReadingList = async (req, res, next) => {
  try {
    // Check if the user is authenticated
    if (!req.session.user) return res.sendStatus(401);

    // Retrieve logged client username and current blog id
    const { username } = req.session.user;
    const { blogId } = req.params;

    // Find current logged user and check, if already added current blog to reading list
    const loggedUser = await User.findOne({ username }).select("readingList");
    if (loggedUser.readingList.includes(blogId)) {
      return res.sendStatus(400);
    }

    // Update logged user reading list and save
    loggedUser.readingList.push(blogId);
    await loggedUser.save();

    // Find the totalBookmark and update
    const readingListedBlog = await Blog.findById(blogId).select(
      "totalBookmark"
    );
    readingListedBlog.totalBookmark += 1;
    await readingListedBlog.save();

    res.sendStatus(200);
  } catch (error) {
    // Pass the error to Express error handler middleware
    next(error);
  }
};

/**
 * Remove a blog post from the reading list of the logged-in user and update the total bookmark count of the blog.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @throws {Error} - Throws an error if there is any issue during the process.
 */

const RemoveFromReadingList = async (req, res, next) => {
  try {
    // Check if the user is authenticated
    if (!req.session.user) return res.sendStatus(401);

    // Retrieve logged client username and current blog id
    const { username } = req.session.user;
    const { blogId } = req.params;

    // Find current logged user and check, if already added current blog to reading list
    const loggedUser = await User.findOne({ username }).select("readingList");
    if (!loggedUser.readingList.includes(blogId)) {
      return res.sendStatus(400);
    }

    // Update logged user reading list and save
    loggedUser.readingList.splice(loggedUser.readingList.indexOf(blogId), 1);
    await loggedUser.save();

    // Find the totalBookmark and update
    const readingListedBlog = await Blog.findById(blogId).select(
      "totalBookmark"
    );
    readingListedBlog.totalBookmark -= 1;
    await readingListedBlog.save();

    res.sendStatus(200);
  } catch (error) {
    // Pass the error to Express error handler middleware
    next(error);
  }
};

const renderReadingList = async (req, res, next) => {
  try {
    // Retrieve logged client username
    const { username } = req.session.user;

    // Retrieve total amount of reading list blogs
    const { readingList } = await User.findOne({ username }).select(
      "readingList"
    );

    // Get pagination object
    const pagination = getPagination(
      "/reading-list/",
      req.params,
      8,
      readingList.length
    );

    // Retrieve reading list blogs based on pagination parameters
    const readingListBlogs = await Blog.find({
      _id: { $in: readingList },
    })
      .select("owner createdAt readingTime title reaction totalBookmark")
      .populate({
        path: "owner",
        select: "name username profilePhoto",
      })
      .skip(pagination.skip)
      .limit(pagination.limit);

    res.render("./pages/reading_list", {
      sessionUser: req.session.user,
      readingListBlogs,
      pagination,
    });
  } catch (error) {
    // Pass the error to Express error handler middleware
    next(error);
  }
};

module.exports = {
  addToReadingList,
  RemoveFromReadingList,
  renderReadingList,
};
