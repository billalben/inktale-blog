"use strict";

const Blog = require("../models/blog_model");

/**
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @throws {Error} - Throws an error if there is an issue with the request.
 */
const updateVisit = async (req, res) => {
  try {
    // Destructure blogId from the request parameters
    const { blogId } = req.params;

    // Find the blog and update its totalVisit count
    const visitedBlog = await Blog.findById(blogId)
      .select("totalVisit owner")
      .populate({
        path: "owner",
        select: "totalVisits",
      });

    // Increment the totalVisit count
    visitedBlog.totalVisit += 1;
    await visitedBlog.save();

    // Update the totalVisits count for the blog owner
    visitedBlog.owner.totalVisits += 1;
    await visitedBlog.owner.save();

    // Send a success response
    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating totalVisit", error.message);
    throw error;
  }
};

module.exports = updateVisit;
