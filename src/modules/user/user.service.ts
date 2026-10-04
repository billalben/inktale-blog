import bcrypt from "bcrypt";
import mongoose from "mongoose";
import type { Request } from "express";
import { User } from "./user.model.js";
import { Blog } from "../blog/blog.model.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../shared/config/cloudinary.js";
import { getPagination } from "../../shared/utils/pagination.js";
import { imageConfig } from "../../shared/config/image-config.js";

export type ServiceError =
  | { code: "not_found" }
  | { code: "email_taken" }
  | { code: "username_taken" }
  | { code: "image_too_large"; message: string }
  | { code: "wrong_password" };

function currentSessionUsername(req: Request): string {
  const username = req.session.user?.username;
  if (!username) {
    throw new Error("currentSessionUsername called without an authenticated user");
  }
  return username;
}

export async function getProfile(username: string) {
  const userExists = await User.exists({ username });
  if (!userExists) return null;

  const profile = await User.findOne({ username }).select(
    "profilePhoto username name bio blogs blogPublished createdAt",
  );
  if (!profile) return null;

  const pagination = getPagination(
    `/profile/${username}/`,
    {},
    8,
    profile.blogs.length,
  );

  const profileBlogs = await Blog.find({ _id: { $in: profile.blogs } })
    .select("title createdAt reaction totalBookmark readingTime")
    .populate({ path: "owner", select: "name username profilePhoto" })
    .sort({ createdAt: -1 })
    .limit(pagination.limit)
    .skip(pagination.skip);

  return { profile, profileBlogs, pagination };
}

export async function getDashboard(username: string) {
  return User.findOne({ username })
    .select("totalVisits totalReactions blogs blogPublished")
    .populate({
      path: "blogs",
      select: "title createdAt updatedAt reaction totalVisit",
      options: { sort: { createdAt: "desc" } },
    });
}

export async function getSettings(username: string) {
  return User.findOne({ username });
}

export async function updateBasicInfo(
  req: Request,
): Promise<ServiceError | null> {
  const sessionUsername = currentSessionUsername(req);
  const { name, username, email, bio } = req.body as {
    name?: string;
    username?: string;
    email?: string;
    bio?: string;
  };
  const profilePhotoFile = req.file;

  const currentUser = await User.findOne({ username: sessionUsername }).select(
    "profilePhoto name username email bio",
  );
  if (!currentUser) return { code: "not_found" };

  if (email) {
    if (await User.exists({ email })) {
      return { code: "email_taken" };
    }
    currentUser.email = email;
  }

  if (username) {
    if (await User.exists({ username })) {
      return { code: "username_taken" };
    }
    currentUser.username = username;
    if (req.session.user) req.session.user.username = username;
  }

  if (profilePhotoFile && profilePhotoFile.size > imageConfig.profilePhoto.maxByteSize) {
    return {
      code: "image_too_large",
      message: "Profile photo size must be less than 1MB",
    };
  }

  if (profilePhotoFile) {
    if (currentUser.profilePhoto?.public_id) {
      await deleteFromCloudinary(currentUser.profilePhoto.public_id);
    }
    const publicId = currentUser.username;
    const imageURL = await uploadToCloudinary(profilePhotoFile.path, publicId);
    currentUser.profilePhoto = { url: imageURL, public_id: publicId };
    if (req.session.user) req.session.user.profilePhotoURL = imageURL;
  }

  if (typeof name === "string") {
    currentUser.name = name;
    if (req.session.user) req.session.user.name = name;
  }
  if (typeof bio === "string") {
    currentUser.bio = bio;
  }

  await currentUser.save();
  return null;
}

export async function updatePassword(
  req: Request,
): Promise<ServiceError | null> {
  const sessionUsername = currentSessionUsername(req);
  const { old_password, password } = req.body as {
    old_password: string;
    password: string;
  };

  const currentUser = await User.findOne({ username: sessionUsername }).select(
    "password",
  );
  if (!currentUser) return { code: "not_found" };

  const oldPasswordIsValid = await bcrypt.compare(
    old_password,
    currentUser.password,
  );
  if (!oldPasswordIsValid) return { code: "wrong_password" };

  currentUser.password = await bcrypt.hash(password, 10);
  await currentUser.save();
  return null;
}

export async function deleteAccount(req: Request): Promise<void> {
  const username = currentSessionUsername(req);

  const currentUser = await User.findOne({ username }).select("blogs");
  if (!currentUser) return;

  await Blog.deleteMany({ _id: { $in: currentUser.blogs } });
  await User.deleteOne({ username });

  const db = mongoose.connection.db;
  if (db) {
    const Session = db.collection("sessions");
    await Session.deleteMany({
      session: { $regex: username, $options: "i" },
    });
  }

  req.session.destroy(() => {
    // Session cleared; controller sends response.
  });
}
