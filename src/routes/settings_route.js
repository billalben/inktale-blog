"use strict";

const router = require("express").Router();

const {
  renderSettings,
  updateBasicInfo,
  updatePassword,
} = require("../controllers/settings_controller");

// GET route: render the settings page
router.get("/", renderSettings);

// PUT route: update user profile
router.put("/basic-info", updateBasicInfo);

// PUT route: update user password
router.put("/password", updatePassword);

module.exports = router;
