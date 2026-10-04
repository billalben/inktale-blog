import mongoose from "mongoose";
import type { Request } from "express";
import { User } from "../user/user.model.js";
import { Blog } from "./blog.model.js";
import { getPagination } from "../../shared/utils/pagination.js";

export type ReadingListError =
  | { code: "already_added" }
  | { code: "not_in_list" }
  | { code: "not_found" };

function currentUsername(req: Request): string | null {
  return req.session.user?.username ?? null;
}

export async function addToReadingList(
  req: Request,
): Promise<ReadingListError | null> {
  const username = currentUsername(req);
  if (!username) return { code: "not_found" };

  const blogId = req.params.blogId;
  if (typeof blogId !== "string" || blogId.length === 0) {
    return { code: "not_found" };
  }

  const loggedUser = await User.findOne({ username }).select("readingList");
  if (!loggedUser) return { code: "not_found" };

  if (loggedUser.readingList.some((id) => id.toString() === blogId)) {
    return { code: "already_added" };
  }

  loggedUser.readingList.push(new mongoose.Types.ObjectId(blogId));
  await loggedUser.save();

  const readingListedBlog = await Blog.findById(blogId).select("totalBookmark");
  if (!readingListedBlog) return { code: "not_found" };
  readingListedBlog.totalBookmark += 1;
  await readingListedBlog.save();

  return null;
}

export async function removeFromReadingList(
  req: Request,
): Promise<ReadingListError | null> {
  const username = currentUsername(req);
  if (!username) return { code: "not_found" };

  const blogId = req.params.blogId;
  if (typeof blogId !== "string" || blogId.length === 0) {
    return { code: "not_found" };
  }

  const loggedUser = await User.findOne({ username }).select("readingList");
  if (!loggedUser) return { code: "not_found" };

  const index = loggedUser.readingList.findIndex(
    (id) => id.toString() === blogId,
  );
  if (index === -1) return { code: "not_in_list" };

  loggedUser.readingList.splice(index, 1);
  await loggedUser.save();

  const readingListedBlog = await Blog.findById(blogId).select("totalBookmark");
  if (!readingListedBlog) return { code: "not_found" };
  readingListedBlog.totalBookmark -= 1;
  await readingListedBlog.save();

  return null;
}

export async function getReadingListViewFor(
  username: string,
  reqParams: { pageNumber?: string },
) {
  const user = await User.findOne({ username }).select("readingList");
  if (!user) return null;

  const pagination = getPagination(
    "/reading-list/",
    reqParams,
    8,
    user.readingList.length,
  );

  const readingListBlogs = await Blog.find({
    _id: { $in: user.readingList },
  })
    .select("owner createdAt readingTime title reaction totalBookmark")
    .populate({ path: "owner", select: "name username profilePhoto" })
    .skip(pagination.skip)
    .limit(pagination.limit);

  return { readingListBlogs, pagination };
}
