import { Router } from "express";
import { upload } from "../../shared/middlewares/upload.js";
import { requireAuth } from "../auth/auth.middleware.js";
import {
  postCreateBlog,
  putBlog,
  removeBlog,
  renderBlogDetail,
  renderBlogEdit,
  renderCreateBlog,
  renderHome,
} from "./blog.controller.js";

export const blogRouter = Router();

// Home page (public)
blogRouter.get("/", renderHome);
blogRouter.get("/page/:pageNumber", renderHome);

// Create blog (auth-gated)
blogRouter.get("/create-blog", requireAuth, renderCreateBlog);
blogRouter.post(
  "/create-blog",
  requireAuth,
  upload.single("banner"),
  postCreateBlog,
);

// Edit blog (auth-gated) — must be registered before /:blogId
blogRouter.get("/blogs/:blogId/edit", requireAuth, renderBlogEdit);
blogRouter.put(
  "/blogs/:blogId/edit",
  requireAuth,
  upload.single("banner"),
  putBlog,
);

// Delete blog (auth-gated) — must be registered before /:blogId
blogRouter.delete("/blogs/:blogId/delete", requireAuth, removeBlog);

// Blog detail (public) — catch-all for /blogs/:blogId
blogRouter.get("/blogs/:blogId", renderBlogDetail);
