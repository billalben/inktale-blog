import { Schema, model, Types, type HydratedDocument } from "mongoose";

export interface IBlog {
  banner: {
    url: string;
    public_id: string;
  };
  title: string;
  content: string;
  owner: Types.ObjectId;
  reaction: number;
  readingTime: number;
  totalBookmark: number;
  totalVisit: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type BlogDoc = HydratedDocument<IBlog>;

const blogSchema = new Schema<IBlog>(
  {
    banner: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reaction: { type: Number, default: 0 },
    readingTime: { type: Number, required: true },
    totalBookmark: { type: Number, default: 0 },
    totalVisit: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Blog = model<IBlog>("Blog", blogSchema);
