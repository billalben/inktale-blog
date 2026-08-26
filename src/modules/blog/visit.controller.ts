import type { Request, Response, NextFunction } from "express";
import { recordVisit } from "./visit.service.js";

export async function putVisit(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await recordVisit(_req);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}
