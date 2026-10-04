import path from "node:path";
import express from "express";
import cors from "cors";
import compression from "compression";

import { env } from "./shared/config/env.js";
import { rateLimiter } from "./shared/middlewares/rate-limiter.js";
import { sessionMiddleware } from "./shared/middlewares/session.js";
import { errorHandler } from "./shared/middlewares/error.js";

import { authRouter } from "./modules/auth/index.js";
import { userRouter } from "./modules/user/index.js";
import {
  blogRouter,
  reactionRouter,
  readingListRouter,
  visitRouter,
} from "./modules/blog/index.js";

export function createApp(): express.Express {
  const app = express();

  // Security & infra middleware
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(rateLimiter);

  // Compression & static assets
  app.use(compression());
  app.use(express.static(path.join(import.meta.dirname, "..", "public")));

  // View engine
  app.set("view engine", "ejs");
  app.set("views", path.join(import.meta.dirname, "views"));

  // Body parsers
  app.use(express.json({ limit: "6mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Session (must come after body parsers, before routes that use req.session)
  app.use(sessionMiddleware);

  // Routes (each router uses absolute paths, mounted once at /)
  app.use(authRouter);
  app.use(blogRouter);
  app.use(reactionRouter);
  app.use(readingListRouter);
  app.use(visitRouter);
  app.use(userRouter);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}
