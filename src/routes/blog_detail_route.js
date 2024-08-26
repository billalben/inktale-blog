"use strict";

const router = require("express").Router();

/**
 * Custom modules
 */

const renderBlogDetail = require("../controllers/blog_detail_controller");


// Get route: Render The Create Blog Page
router.get("/:blogId", renderBlogDetail);

module.exports = router;
