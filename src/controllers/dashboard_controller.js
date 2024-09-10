"use strict";

const User = require("../models/user_model");

/**
 * Render dashboard page for logged-in users.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @throws {Error} - Throws error if there is an issue rendering the dashboard.
 */
const renderDashboard = async (req, res) => {
  try {
    // Get logged user username
    const { username } = req.session.user;

    // Get session user data
    const loggedUser = await User.findOne({ username })
      .select("totalVisits totalReactions blogs blogPublished")
      .populate({
        path: "blogs",
        select: "title createdAt updatedAt reaction totalVisit",
        options: { sort: { createdAt: "desc" } },
      });

    // Render dashboard view
    res.render("./pages/dashboard", {
      sessionUser: req.session.user,
      loggedUser,
    });
  } catch (error) {
    console.error("Error rendering dashboard:", error.message);
    throw error;
  }
};

module.exports = renderDashboard;
