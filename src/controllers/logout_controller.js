"use strict";

/**
 * Logout the user by destroying the session and redirecting to the login page.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

const logout = async (req, res) => {
  try {
    // Delete user session
    req.session.destroy();

    res.redirect("/login");
  } catch (error) {
    console.error("Error in logout: ", error.message);
    throw error;
  }
};

module.exports = logout;
