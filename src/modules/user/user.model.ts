import { Schema, model, Types, type HydratedDocument } from "mongoose";

export interface IUser {
  profilePhoto?: {
    url?: string;
    public_id?: string;
  };
  name: string;
  username: string;
  bio?: string;
  email: string;
  password: string;
  blogs: Types.ObjectId[];
  blogPublished: number;
  reactedBlogs: Types.ObjectId[];
  totalVisits: number;
  totalReactions: number;
  readingList: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserDoc = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>(
  {
    profilePhoto: {
      url: { type: String },
      public_id: { type: String },
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    bio: String,
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    blogs: {
      type: [Schema.Types.ObjectId],
      ref: "Blog",
    },
    blogPublished: {
      type: Number,
      default: 0,
    },
    reactedBlogs: {
      type: [Schema.Types.ObjectId],
      ref: "Blog",
    },
    totalVisits: {
      type: Number,
      default: 0,
    },
    totalReactions: {
      type: Number,
      default: 0,
    },
    readingList: {
      type: [Schema.Types.ObjectId],
      ref: "Blog",
    },
  },
  { timestamps: true },
);

export const User = model<IUser>("User", userSchema);
