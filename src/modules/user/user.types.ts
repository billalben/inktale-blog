import type { Pagination } from "../../shared/utils/pagination.js";

export interface ProfileView {
  profile: {
    profilePhoto?: { url?: string; public_id?: string };
    username: string;
    name: string;
    bio?: string;
    blogs: import("mongoose").Types.ObjectId[];
    blogPublished: number;
    createdAt?: Date;
  };
  profileBlogs: import("mongoose").Types.ObjectId[];
  pagination: Pagination;
}

export interface DashboardView {
  loggedUser: {
    totalVisits: number;
    totalReactions: number;
    blogs: unknown[];
    blogPublished: number;
  };
}

export interface SettingsView {
  currentUser: {
    profilePhoto?: { url?: string; public_id?: string };
    name: string;
    username: string;
    email: string;
    bio?: string;
  };
}
