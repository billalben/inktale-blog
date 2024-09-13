"use strict";

const User = require("../models/user_model");

/**
 * Retrieves settings for the current user and renders the settings page.
 * @async
 * @function renderSettings
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @throws {Error} - Throws error if there is an issue rendering the settings page.
 */
const renderSettings = async (req, res) => {
  try {
    // Retrieve logged client username
    const { username } = req.session.user;

    // Retrieve current user
    const currentUser = await User.findOne({ username });

    // Render the settings page
    res.render("./pages/settings", {
      sessionUser: req.session.user,
      currentUser,
    });
  } catch (error) {
    console.error("Error rendering settings page: ", error.message);
    throw error;
  }
};

module.exports = { renderSettings };
