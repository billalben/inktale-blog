"use strict";

/**
 * Controller function to render the home page with blog data.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @throws {Error} - An error if the blog data cannot be retrieved.
 */

const renderHome = async (req, res) => {
  try {
    res.render("./pages/home", {
      sessionUser: req.session.user,
    });
  } catch (error) {
    console.error("Error rendering home page", error.message);
    throw error;
  }
};

module.exports = renderHome;
