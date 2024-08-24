"use strict";

const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    banner: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    reaction: {
      type: Number,
      default: 0,
    },
    readingTime: {
      type: Number,
      required: true,
    },
    totalBookmark: {
      type: Number,
      default: 0,
    },
    totalVisit: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
