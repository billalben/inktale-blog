import type { Request, Response, NextFunction } from "express";

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { userAuthenticated } = req.session.user ?? {};

  if (userAuthenticated) {
    next();
    return;
  }

  res.redirect("/login");
}
