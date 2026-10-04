import type { Request, Response, NextFunction } from "express";
import {
  addToReadingList,
  getReadingListViewFor,
  removeFromReadingList,
} from "./reading-list.service.js";

export async function putReadingList(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    const result = await addToReadingList(req);
    if (result === null) {
      res.sendStatus(200);
      return;
    }
    if (result.code === "already_added") {
      res.sendStatus(400);
      return;
    }
    res.sendStatus(404);
  } catch (error) {
    next(error);
  }
}

export async function deleteReadingList(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    const result = await removeFromReadingList(req);
    if (result === null) {
      res.sendStatus(200);
      return;
    }
    if (result.code === "not_in_list") {
      res.sendStatus(400);
      return;
    }
    res.sendStatus(404);
  } catch (error) {
    next(error);
  }
}

export async function renderReadingList(
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

    const data = await getReadingListViewFor(username, req.params);
    if (!data) {
      res.render("./pages/404");
      return;
    }

    res.render("./pages/reading_list", {
      sessionUser: req.session.user,
      ...data,
    });
  } catch (error) {
    next(error);
  }
}
