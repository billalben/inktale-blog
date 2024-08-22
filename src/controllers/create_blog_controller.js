"use strict";

/**
 * Render the create blog page
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const renderCreateBlog = (req, res) => {
  res.render("./pages/create_blog", {
    sessionUser: req.session.user,
    route: req.originalUrl,
  });
};

const postCreateBlog = (req, res) => {
  try {
    const { banner, title, content } = req.body;
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

module.exports = { renderCreateBlog, postCreateBlog };
