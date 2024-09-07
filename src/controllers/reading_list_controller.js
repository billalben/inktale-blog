"use strict";

const User = require("../models/user_model");
const Blog = require("../models/blog_model");

/**
 * Add a blog post to the reading list of the logged-in user and update the total bookmark count of the blog.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @throws {Error} - Throws an error if there is any issue during the process.
 */

const addToReadingList = async (req, res) => {
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
    console.error("Error adding reading", error.message);
    throw error;
  }
};

/**
 * Remove a blog post from the reading list of the logged-in user and update the total bookmark count of the blog.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @throws {Error} - Throws an error if there is any issue during the process.
 */

const RemoveFromReadingList = async (req, res) => {
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
    console.error("Error removing reading list", error.message);
    throw error;
  }
};

module.exports = {
  addToReadingList,
  RemoveFromReadingList,
};
