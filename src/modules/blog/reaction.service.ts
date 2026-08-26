import type { Request } from "express";
import { Blog } from "./blog.model.js";
import { User } from "../user/user.model.js";

export type ReactionError =
  | { code: "already_reacted" }
  | { code: "not_reacted" }
  | { code: "not_found" };

function currentUsername(req: Request): string | null {
  return req.session.user?.username ?? null;
}

export async function reactToBlog(req: Request): Promise<ReactionError | null> {
  const username = currentUsername(req);
  if (!username) return { code: "not_found" };

  const blogId = req.params.blogId;
  if (typeof blogId !== "string" || blogId.length === 0) {
    return { code: "not_found" };
  }

  const currentUser = await User.findOne({ username }).select("reactedBlogs");
  if (!currentUser) return { code: "not_found" };

  if (currentUser.reactedBlogs.some((id) => id.toString() === blogId)) {
    return { code: "already_reacted" };
  }

  const reactedBlog = await Blog.findById(blogId)
    .select("reaction owner")
    .populate({ path: "owner", select: "totalReactions" });
  if (!reactedBlog) return { code: "not_found" };

  reactedBlog.reaction += 1;
  await reactedBlog.save();

  currentUser.reactedBlogs.push(reactedBlog._id);
  await currentUser.save();

  const owner = reactedBlog.owner as unknown as { totalReactions: number };
  owner.totalReactions += 1;
  await (
    reactedBlog.owner as unknown as { save: () => Promise<unknown> }
  ).save();

  return null;
}

export async function unreactToBlog(
  req: Request,
): Promise<ReactionError | null> {
  const username = currentUsername(req);
  if (!username) return { code: "not_found" };

  const blogId = req.params.blogId;
  if (typeof blogId !== "string" || blogId.length === 0) {
    return { code: "not_found" };
  }

  const currentUser = await User.findOne({ username }).select("reactedBlogs");
  if (!currentUser) return { code: "not_found" };

  if (!currentUser.reactedBlogs.some((id) => id.toString() === blogId)) {
    return { code: "not_reacted" };
  }

  const reactedBlog = await Blog.findById(blogId)
    .select("reaction owner")
    .populate({ path: "owner", select: "totalReactions" });
  if (!reactedBlog) return { code: "not_found" };

  reactedBlog.reaction -= 1;
  await reactedBlog.save();

  const blogIdIndex = currentUser.reactedBlogs.findIndex(
    (id) => id.toString() === blogId,
  );
  if (blogIdIndex !== -1) {
    currentUser.reactedBlogs.splice(blogIdIndex, 1);
  }
  await currentUser.save();

  const owner = reactedBlog.owner as unknown as { totalReactions: number };
  owner.totalReactions -= 1;
  await (
    reactedBlog.owner as unknown as { save: () => Promise<unknown> }
  ).save();

  return null;
}
