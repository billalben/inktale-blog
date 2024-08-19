"use strict";

const bcrypt = require("bcrypt");

/**
 * Custom modules
 */

const User = require("../models/user_model");
const generateUsername = require("../utils/generate_username_util");

/**
 * Renders the register page.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */

const renderRegister = (req, res) => {
  const { userAuthenticated } = req.session.user || false;

  // Handle case where user is already authenticated
  if (userAuthenticated) return res.redirect("/");

  res.render("./pages/register");
};

/**
 * Handles the register process for a new user.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} - A Promise that resolves after register process.
 * @throws {Error} - An error if the register process fails.
 */

const postRegister = async (req, res) => {
  try {
    // Extract the user data from the request body
    const { name, email, password } = req.body;

    // Generate a username based on the user's name
    const username = generateUsername(name);

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with provided data
    await User.create({
      name,
      email,
      username,
      password: hashedPassword,
    });

    // Redirect to the login page upon successful registration
    res.redirect("/login");
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern.email) {
        return res.status(400).send({
          message: "This email is already associated with an account",
        });
      }

      if (error.keyPattern.username) {
        return res.status(400).send({
          message: "This username is already taken",
        });
      }
    } else {
      return res
        .status(400)
        .send({ message: `Failed To Register User.<br>${error.message}` });
    }

    // Log and throw the error if any occurs during register process
    console.log("postRegister", error.message);
    throw error;
  }
};

module.exports = { renderRegister, postRegister };
