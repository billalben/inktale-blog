"use strict";

const router = require("express").Router();
const logout = require("../controllers/logout_controller");

/**
 * Custom modules
 */

const login  = require("../controllers/logout_controller");

// Post route: Handle user logout.
router.post("/", logout);

module.exports = router;
