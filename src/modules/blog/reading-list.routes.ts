import { Router } from "express";
import { requireAuth } from "../auth/auth.middleware.js";
import {
  deleteReadingList,
  putReadingList,
  renderReadingList,
} from "./reading-list.controller.js";

export const readingListRouter = Router();

// Auth-gated page render
readingListRouter.get("/reading-list", requireAuth, renderReadingList);
readingListRouter.get("/reading-list/page/:pageNumber", requireAuth, renderReadingList);

// Per-blog toggle (public route — handlers enforce auth via session check)
readingListRouter.put("/blogs/:blogId/reading-list", putReadingList);
readingListRouter.delete("/blogs/:blogId/reading-list", deleteReadingList);
