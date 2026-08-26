import type { Request, Response, NextFunction } from "express";
import { markdown } from "../../shared/config/markdown.js";
import {
  createBlog,
  deleteBlog,
  getBlogDetail,
  getBlogForEdit,
  getHomeBlogs,
  updateBlog,
} from "./blog.service.js";
import { User } from "../user/user.model.js";

export async function renderHome(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { latestBlogs, pagination } = await getHomeBlogs(req.params);
    res.render("./pages/home", {
      sessionUser: req.session.user,
      latestBlogs,
      pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function renderBlogDetail(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const blogId = req.params.blogId;
    if (typeof blogId !== "string" || blogId.length === 0) {
      res.render("./pages/404");
      return;
    }

    const result = await getBlogDetail(blogId);
    if ("code" in result) {
      res.render("./pages/404");
      return;
    }

    let user:
      | { reactedBlogs: import("mongoose").Types.ObjectId[]; readingList: import("mongoose").Types.ObjectId[] }
      | undefined;
    if (req.session.user) {
      const found = await User.findOne({
        username: req.session.user.username,
      }).select("reactedBlogs readingList");
      if (found) {
        user = {
          reactedBlogs: found.reactedBlogs,
          readingList: found.readingList,
        };
      }
    }

    res.render("./pages/blog_detail", {
      sessionUser: req.session.user,
      blog: result.blog,
      ownerBlogs: result.ownerBlogs,
      user,
      markdown,
    });
  } catch (error) {
    next(error);
  }
}

export function renderCreateBlog(req: Request, res: Response): void {
  res.render("./pages/create_blog", {
    sessionUser: req.session.user,
    route: req.originalUrl,
  });
}

export async function postCreateBlog(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await createBlog(req);

    if ("blogId" in result) {
      res.redirect(`/blogs/${result.blogId}`);
      return;
    }

    if (result.code === "banner_required") {
      res.status(400).json({ message: "Banner image is required." });
      return;
    }
    if (result.code === "banner_too_large") {
      res.status(400).json({ message: result.message });
      return;
    }
    if (result.code === "not_found") {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(500);
  } catch (error) {
    next(error);
  }
}

export async function renderBlogEdit(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await getBlogForEdit(req);

    if ("code" in result) {
      if (result.code === "unauthorized") {
        res.redirect("/login");
        return;
      }
      if (result.code === "not_found" || result.code === "invalid_id") {
        res.render("./pages/404");
        return;
      }
      if (result.code === "unauthorized_owner") {
        res
          .status(403)
          .send(`<h2>Sorry, you are not authorized to edit this blog.</h2>`);
        return;
      }
    }

    res.render("./pages/blog_update", {
      sessionUser: req.session.user,
      currentBlog: result.currentBlog,
    });
  } catch (error) {
    next(error);
  }
}

export async function putBlog(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await updateBlog(req);

    if (result === null) {
      res.sendStatus(200);
      return;
    }
    if (result.code === "banner_too_large") {
      res.status(400).json({ message: result.message });
      return;
    }
    if (result.code === "not_found") {
      res.sendStatus(404);
      return;
    }
    if (result.code === "unauthorized_owner") {
      res
        .status(403)
        .send(`<h2>Sorry, you are not authorized to edit this blog.</h2>`);
      return;
    }
    res.sendStatus(500);
  } catch (error) {
    next(error);
  }
}

export async function removeBlog(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await deleteBlog(req);

    if (result === null) {
      res.sendStatus(200);
      return;
    }
    res.sendStatus(500);
  } catch (error) {
    next(error);
  }
}
