import type { SessionUser } from "../../modules/auth/auth.types.js";

declare module "express-session" {
  interface SessionData {
    user?: SessionUser;
  }
}

export {};
