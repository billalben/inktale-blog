import { Router } from "express";
import {
  logout,
  postLogin,
  postRegister,
  renderLogin,
  renderRegister,
} from "./auth.controller.js";

export const authRouter = Router();

authRouter.get("/register", renderRegister);
authRouter.post("/register", postRegister);

authRouter.get("/login", renderLogin);
authRouter.post("/login", postLogin);

authRouter.post("/logout", logout);
