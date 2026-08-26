import type { Request, Response, NextFunction } from "express";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  // 4 args required by Express to recognize error-handling middleware
  _next: NextFunction,
): void {
  console.error(error instanceof Error ? error.stack : error);
  res.status(500).render("./pages/error", {
    message: "Something went wrong!",
  });
}
