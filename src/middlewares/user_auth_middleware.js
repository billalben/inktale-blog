"use strict";

/**
 * Middleware to check if the user is authenticated.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

const userAuth = (req, res, next) => {
  const { userAuthenticated } = req.session.user || {};

  // Handle case when user is authenticated
  if (userAuthenticated) return next();

  // Redirect to login page if user is not authenticated
  res.redirect("/login");
};

module.exports = userAuth;
