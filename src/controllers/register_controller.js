"use strict";

/**
 * Renders the register page
 * @param {object} req - The request object
 * @param {object} res - The response object
 */

const renderRegister = (req, res) => {
  res.render("./pages/register");
};

module.exports = { renderRegister };
