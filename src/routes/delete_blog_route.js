"use strict";

const router = require("express").Router();

const deleteBlog = require("../controllers/blog_delete_controller");

// DELETE Route: delete a specific blog
router.delete("/:blogId/delete", deleteBlog);

module.exports = router;
