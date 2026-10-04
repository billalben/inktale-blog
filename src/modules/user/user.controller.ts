import type { Request, Response, NextFunction } from "express";
import {
  deleteAccount,
  getDashboard,
  getProfile,
  getSettings,
  updateBasicInfo,
  updatePassword,
} from "./user.service.js";

export async function renderProfile(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const username = req.params.username;
    if (typeof username !== "string" || username.length === 0) {
      res.render("./pages/404");
      return;
    }

    const data = await getProfile(username);
    if (!data) {
      res.render("./pages/404");
      return;
    }

    res.render("./pages/profile", {
      sessionUser: req.session.user,
      ...data,
    });
  } catch (error) {
    next(error);
  }
}

export async function renderDashboard(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const username = req.session.user?.username;
    if (!username) {
      res.redirect("/login");
      return;
    }

    const loggedUser = await getDashboard(username);
    res.render("./pages/dashboard", {
      sessionUser: req.session.user,
      loggedUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function renderSettings(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const username = req.session.user?.username;
    if (!username) {
      res.redirect("/login");
      return;
    }

    const currentUser = await getSettings(username);
    res.render("./pages/settings", {
      sessionUser: req.session.user,
      currentUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function postUpdateBasicInfo(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await updateBasicInfo(req);

    if (result === null) {
      res.sendStatus(200);
      return;
    }

    if (result.code === "email_taken") {
      res.status(400).json({
        message:
          "Email is already associated with another account. Please choose a different one.",
      });
      return;
    }
    if (result.code === "username_taken") {
      res.status(400).json({
        message: "Username is already taken. Please choose a different one.",
      });
      return;
    }
    if (result.code === "image_too_large") {
      res.status(400).json({ message: result.message });
      return;
    }
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

export async function postUpdatePassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await updatePassword(req);

    if (result === null) {
      res.sendStatus(200);
      return;
    }
    if (result.code === "wrong_password") {
      res.status(400).json({
        message: "Old password is incorrect. Please try again.",
      });
      return;
    }
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

export async function postDeleteAccount(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await deleteAccount(req);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}
