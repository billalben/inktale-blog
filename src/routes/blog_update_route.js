"use strict";

const router = require("express").Router();

const { renderBlogEdit, updateBlog } = require("../controllers/blog_update_controller");

// GET ROUTE: Render blog edit page
router.get("/:blogId/edit", renderBlogEdit);

// PUT ROUTE: Update blog
router.put("/:blogId/edit", updateBlog);

module.exports = router;
