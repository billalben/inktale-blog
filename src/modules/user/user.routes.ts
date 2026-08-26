import { Router } from "express";
import { upload } from "../../shared/middlewares/upload.js";
import { requireAuth } from "../auth/auth.middleware.js";
import {
  postDeleteAccount,
  postUpdateBasicInfo,
  postUpdatePassword,
  renderDashboard,
  renderProfile,
  renderSettings,
} from "./user.controller.js";

export const userRouter = Router();

// Public profile
userRouter.get("/profile/:username", renderProfile);
userRouter.get("/profile/:username/page/:pageNumber", renderProfile);

// Auth-gated dashboard
userRouter.get("/dashboard", requireAuth, renderDashboard);

// Auth-gated settings
userRouter.get("/settings", requireAuth, renderSettings);
userRouter.put(
  "/settings/basic-info",
  requireAuth,
  upload.single("profilePhoto"),
  postUpdateBasicInfo,
);
userRouter.put("/settings/password", requireAuth, postUpdatePassword);
userRouter.delete("/settings/account", requireAuth, postDeleteAccount);
