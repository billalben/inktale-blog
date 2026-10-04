import type { Pagination } from "../../shared/utils/pagination.js";

export interface HomeView {
  latestBlogs: unknown[];
  pagination: Pagination;
}

export interface BlogDetailView {
  blog: unknown;
  ownerBlogs: unknown[];
  user:
    | {
        reactedBlogs: import("mongoose").Types.ObjectId[];
        readingList: import("mongoose").Types.ObjectId[];
      }
    | undefined;
}
