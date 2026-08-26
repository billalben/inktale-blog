import { randomBytes } from "node:crypto";
import mongoose from "mongoose";
import type { Request } from "express";
import { Blog } from "./blog.model.js";
import { User } from "../user/user.model.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../shared/config/cloudinary.js";
import { getReadingTime } from "../../shared/utils/reading-time.js";
import { getPagination } from "../../shared/utils/pagination.js";
import { imageConfig } from "../../shared/config/image-config.js";

export type ServiceError =
  | { code: "not_found" }
  | { code: "invalid_id" }
  | { code: "unauthorized" }
  | { code: "unauthorized_owner" }
  | { code: "banner_required" }
  | { code: "banner_too_large"; message: string };

export async function getHomeBlogs(reqParams: { pageNumber?: string }) {
  const totalBlogs = await Blog.countDocuments();
  const pagination = getPagination("/", reqParams, 8, totalBlogs);

  const latestBlogs = await Blog.find()
    .select(
      "banner author createdAt readingTime title reaction totalBookmark",
    )
    .populate({ path: "owner", select: "name username profilePhoto" })
    .sort({ createdAt: "desc" })
    .limit(pagination.limit)
    .skip(pagination.skip);

  return { latestBlogs, pagination };
}

export async function getBlogDetail(blogId: string) {
  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return { code: "invalid_id" as const };
  }

  const blogExists = await Blog.exists({
    _id: new mongoose.Types.ObjectId(blogId),
  });
  if (!blogExists) return { code: "not_found" as const };

  const blog = await Blog.findById(blogId).populate({
    path: "owner",
    select: "name username profilePhoto",
  });

  const ownerBlogs = await Blog.find({
    owner: blog!.owner._id,
  })
    .select("title reaction totalBookmark owner readingTime createdAt")
    .populate({ path: "owner", select: "name username profilePhoto" })
    .where("_id")
    .nin([blogId])
    .sort({ createdAt: "desc" })
    .limit(3);

  return { blog, ownerBlogs };
}

export async function createBlog(
  req: Request,
): Promise<{ blogId: string } | ServiceError> {
  const bannerFile = req.file;
  if (!bannerFile) {
    return { code: "banner_required" };
  }

  if (bannerFile.size > imageConfig.blogBanner.maxByteSize) {
    return {
      code: "banner_too_large",
      message: "Banner image should be less than 3 MB.",
    };
  }

  const username = req.session.user?.username;
  if (!username) return { code: "unauthorized" };

  const publicId = randomBytes(10).toString("hex");
  const bannerURL = await uploadToCloudinary(bannerFile.path, publicId);

  const { title, content } = req.body as { title: string; content: string };

  const user = await User.findOne({ username }).select(
    "_id blogs blogPublished",
  );
  if (!user) return { code: "not_found" };

  const newBlog = await Blog.create({
    banner: { url: bannerURL, public_id: publicId },
    title,
    content,
    owner: user._id,
    readingTime: getReadingTime(content),
  });

  user.blogs.push(newBlog._id);
  user.blogPublished += 1;
  await user.save();

  return { blogId: newBlog._id.toString() };
}

export async function updateBlog(req: Request): Promise<ServiceError | null> {
  const blogId = req.params.blogId;
  if (typeof blogId !== "string" || blogId.length === 0) {
    return { code: "invalid_id" };
  }

  const sessionUsername = req.session.user?.username;
  if (!sessionUsername) return { code: "unauthorized" };

  const { title, content } = req.body as { title: string; content: string };
  const bannerFile = req.file;

  const updatedBlog = await Blog.findById(blogId)
    .select("banner title content owner")
    .populate({ path: "owner", select: "username" });
  if (!updatedBlog) return { code: "not_found" };

  const ownerUsername = (
    updatedBlog.owner as unknown as { username: string }
  ).username;
  if (ownerUsername !== sessionUsername) {
    return { code: "unauthorized_owner" };
  }

  if (bannerFile && bannerFile.size > imageConfig.blogBanner.maxByteSize) {
    return {
      code: "banner_too_large",
      message: "Banner image should be less than 3 MB.",
    };
  }

  if (bannerFile) {
    await deleteFromCloudinary(updatedBlog.banner.public_id);
    const bannerURL = await uploadToCloudinary(
      bannerFile.path,
      updatedBlog.banner.public_id,
    );
    updatedBlog.banner.url = bannerURL;
  }

  updatedBlog.title = title;
  updatedBlog.content = content;
  await updatedBlog.save();

  return null;
}

export async function deleteBlog(req: Request): Promise<ServiceError | null> {
  const blogId = req.params.blogId;
  if (typeof blogId !== "string" || blogId.length === 0) {
    return { code: "invalid_id" };
  }

  const username = req.session.user?.username;
  if (!username) return { code: "unauthorized" };

  const deletedBlog = await Blog.findOne({ _id: blogId }).select(
    "banner reaction totalVisit",
  );
  if (!deletedBlog) return { code: "not_found" };

  await deleteFromCloudinary(deletedBlog.banner.public_id);

  const currentUser = await User.findOne({ username }).select(
    "blogPublished totalVisits totalReactions blogs",
  );
  if (!currentUser) return { code: "not_found" };

  currentUser.blogPublished -= 1;
  currentUser.totalVisits -= deletedBlog.totalVisit;
  currentUser.totalReactions -= deletedBlog.reaction;

  const blogIdIndex = currentUser.blogs.findIndex(
    (id) => id.toString() === blogId,
  );
  if (blogIdIndex !== -1) currentUser.blogs.splice(blogIdIndex, 1);

  await currentUser.save();
  await Blog.deleteOne({ _id: blogId });

  return null;
}

export async function getBlogForEdit(req: Request) {
  const blogId = req.params.blogId;
  if (typeof blogId !== "string" || blogId.length === 0) {
    return { code: "invalid_id" as const };
  }

  const sessionUsername = req.session.user?.username;
  if (!sessionUsername) return { code: "unauthorized" as const };

  const currentBlog = await Blog.findById(blogId)
    .select("banner title content owner")
    .populate({ path: "owner", select: "username" });
  if (!currentBlog) return { code: "not_found" as const };

  const ownerUsername = (
    currentBlog.owner as unknown as { username: string }
  ).username;
  if (ownerUsername !== sessionUsername) {
    return { code: "unauthorized_owner" as const };
  }

  return { currentBlog };
}
