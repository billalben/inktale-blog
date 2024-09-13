"use strict";

const router = require("express").Router();

const {
  renderSettings,
  updateBasicInfo,
} = require("../controllers/settings_controller");

// GET Route: Render the settings page
router.get("/", renderSettings);

// PUT Route: Update user profile
router.put("/basic-info", updateBasicInfo);

module.exports = router;
