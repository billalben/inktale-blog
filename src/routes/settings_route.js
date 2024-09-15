"use strict";

const router = require("express").Router();

const {
  renderSettings,
  updateBasicInfo,
  updatePassword,
  deleteAccount,
} = require("../controllers/settings_controller");

const upload = require("../middlewares/multer");

// GET route: render the settings page
router.get("/", renderSettings);

// PUT route: update user profile
router.put("/basic-info", upload.single("profilePhoto"), updateBasicInfo);

// PUT route: update user password
router.put("/password", updatePassword);

// DELETE route: delete user account
router.delete("/account", deleteAccount);

module.exports = router;
