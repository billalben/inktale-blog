"use strict";

const router = require("express").Router();

/**
 * Custom modules
 */

const renderBlogDetail = require("../controllers/blog_detail_controller");

const {
  updateReaction,
  deleteReaction,
} = require("../controllers/reaction_controller");

const {
  addToReadingList,
  RemoveFromReadingList,
} = require("../controllers/reading_list_controller");

// GET Route: Render The Create Blog Page
router.get("/:blogId", renderBlogDetail);

// PUT Route: Update the blog reactions
router.put("/:blogId/reactions", updateReaction);

// DELETE Route: Remove the blog reactions
router.delete("/:blogId/reactions", deleteReaction);

// PUT Route: Add the blog to the user's reading list
router.put("/:blogId/reading-list", addToReadingList);

// DELETE Route: Remove the blog from the user's reading list
router.delete("/:blogId/reading-list", RemoveFromReadingList);

module.exports = router;
