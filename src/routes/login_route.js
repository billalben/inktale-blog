"use strict";

const router = require("express").Router();

/**
 * Custom modules
 */

const { renderLogin, postLogin } = require("../controllers/login_controller");

// Get route: Render The Login Form
router.get("/", renderLogin);

// Post route: Handle Login Form Submission
router.post("/", postLogin);

module.exports = router;
