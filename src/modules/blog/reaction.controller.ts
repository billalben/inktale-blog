import type { Request, Response, NextFunction } from "express";
import { reactToBlog, unreactToBlog } from "./reaction.service.js";

export async function putReaction(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    const result = await reactToBlog(req);
    if (result === null) {
      res.sendStatus(200);
      return;
    }
    if (result.code === "already_reacted" || result.code === "not_reacted") {
      res.sendStatus(400);
      return;
    }
    res.sendStatus(404);
  } catch (error) {
    next(error);
  }
}

export async function deleteReaction(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    const result = await unreactToBlog(req);
    if (result === null) {
      res.sendStatus(200);
      return;
    }
    if (result.code === "not_reacted" || result.code === "already_reacted") {
      res.sendStatus(400);
      return;
    }
    res.sendStatus(404);
  } catch (error) {
    next(error);
  }
}
