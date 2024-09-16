"use strict";

/**
 * Logout the user by destroying the session and redirecting to the home page.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

const logout = async (req, res, next) => {
  try {
    // Delete user session
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    // Pass the error to Express error handler middleware
    next(error);
  }
};

module.exports = logout;
