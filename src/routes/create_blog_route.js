"use strict";

const router = require("express").Router();

/**
 * Custom modules
 */
const { renderCreateBlog, postCreateBlog } = require("../controllers/create_blog_controller");

// Get route: Render The Create Blog Page
router.get("/", renderCreateBlog);

// Post route: Create a new blog
router.post("/", postCreateBlog);

module.exports = router;
