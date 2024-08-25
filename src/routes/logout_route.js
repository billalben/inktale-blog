"use strict";

const router = require("express").Router();

/**
 * Custom modules
 */

const logout  = require("../controllers/logout_controller");

// Post route: Handle user logout.
router.post("/", logout);

module.exports = router;
