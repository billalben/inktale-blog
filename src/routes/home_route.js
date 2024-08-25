"use strict";

const router = require("express").Router();

/**
 * Custom modules
 */
const renderHome = require("../controllers/home_controller");


// Get route: Render The Home Page
router.get(["/", "/page/:pageNumber"], renderHome); 

module.exports = router;
