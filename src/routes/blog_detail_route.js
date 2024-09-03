"use strict";

const router = require("express").Router();

/**
 * Custom modules
 */

const renderBlogDetail = require("../controllers/blog_detail_controller");
const { updateReaction, deleteReaction } = require("../controllers/reaction_controller");

// Get route: Render The Create Blog Page
router.get("/:blogId", renderBlogDetail);

// Put route: Update the blog reactions
router.put("/:blogId/reactions", updateReaction);

// Delete route: Remove the blog reactions
router.delete("/:blogId/reactions", deleteReaction);

module.exports = router;
