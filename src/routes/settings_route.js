"use strict";

const router = require("express").Router();

const { renderSettings } = require("../controllers/settings_controller");

// GET Route: Render the settings page
router.get("/", renderSettings);

module.exports = router;
