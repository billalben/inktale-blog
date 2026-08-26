import type { Request } from "express";
import { Blog } from "./blog.model.js";

export async function recordVisit(req: Request): Promise<void> {
  const blogId = req.params.blogId;
  if (typeof blogId !== "string" || blogId.length === 0) return;

  const visitedBlog = await Blog.findById(blogId)
    .select("totalVisit owner")
    .populate({ path: "owner", select: "totalVisits" });
  if (!visitedBlog) return;

  visitedBlog.totalVisit += 1;
  await visitedBlog.save();

  const owner = visitedBlog.owner as unknown as { totalVisits: number };
  owner.totalVisits += 1;
  await (
    visitedBlog.owner as unknown as { save: () => Promise<unknown> }
  ).save();
}
