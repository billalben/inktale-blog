"use strict";

const User = require("../models/user_model");

const uploadToCloudinary = require("../config/cloudinary_config");

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

/**
 * Update basic information of the logged user such name, username, email, bio and profile photo.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @throws {Error} - Throws error if there is an issue updating basic information.
 */
const updateBasicInfo = async (req, res) => {
  try {
    // Retrieve logged client username
    const { username: sessionUsername } = req.session.user;

    // Retrieve current user based on session username
    const currentUser = await User.findOne({
      username: sessionUsername,
    }).select("profilePhoto name username email bio");

    // Destructure properties from request body
    const { name, username, email, bio, profilePhoto } = req.body;

    // Handle case where new email is already associated with another account
    if (email) {
      if (await User.exists({ email })) {
        return res.status(400).json({
          message:
            "Email is already associated with another account. Please choose a different one.",
        });
      }

      // Update email of the current user
      currentUser.email = email;
    }

    // Handle case where username is already taken
    if (username) {
      if (await User.exists({ username })) {
        return res.status(400).json({
          message: "Username is already taken. Please choose a different one.",
        });
      }

      // Update username of the current user and session user
      currentUser.username = username;
      req.session.user.username = username;
    }

    // If profile photo is provided, upload it to cloudinary and update user's profile photo
    if (profilePhoto) {
      const public_id = currentUser.username;
      const imageURL = await uploadToCloudinary(profilePhoto, public_id);

      currentUser.profilePhoto = {
        url: imageURL,
        public_id,
      };
      req.session.user.profilePhotoURL = imageURL;
    }

    // Update name and bio of the current user and session user
    currentUser.name = name;
    req.session.user.name = name;
    currentUser.bio = bio;

    // Save the updated user information
    await currentUser.save();

    // Send a response indicating success
    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating basic information: ", error.message);
    throw error;
  }
};

module.exports = { renderSettings, updateBasicInfo };
