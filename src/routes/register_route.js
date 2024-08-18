"use strict";

const router = require("express").Router();
const {
  renderRegister,
  postRegister,
} = require("../controllers/register_controller");

// Get route: Render The Register Form
router.get("/", renderRegister);

// Post route: Handle The Registration Form Submission
router.post("/", postRegister);

module.exports = router;
