"use strict";

const bcrypt = require("bcrypt");

const User = require("../models/user_model");

/**
 * Render the login page.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 */

const renderLogin = (req, res) => {
  res.render("./pages/login");
};

/**
 * Handle login form submission.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {Promise<void>} - A promise representing the asynchronous operation.
 */

const postLogin = async (req, res) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Find the user with the provided email
    const currentUser = await User.findOne({ email });

    // Handle case where no user found with the provided email
    if (!currentUser) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    // Check if the provided password matches the stored password
    const passwordIsValid = await bcrypt.compare(
      password,
      currentUser.password
    );

    // Handle case where the password does not match
    if (!passwordIsValid) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    // Set session userAuthenticated to true and redirect to the home page
    req.session.user = {
      userAuthenticated: true,
      name: currentUser.name,
      username: currentUser.username,
      profilePhotoURL: currentUser.profilePhoto?.url,
    };

    return res.redirect("/");
  } catch (error) {
    console.log("postLogin", error.message);
    throw error;
  }
};

module.exports = { renderLogin, postLogin };
