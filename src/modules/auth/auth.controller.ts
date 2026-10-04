import type { Request, Response, NextFunction } from "express";
import { loginUser, registerUser } from "./auth.service.js";

export function renderRegister(req: Request, res: Response): void {
  const { userAuthenticated } = req.session.user ?? {};

  if (userAuthenticated) {
    res.redirect("/");
    return;
  }

  res.render("./pages/register");
}

export async function postRegister(
  req: Request,
  res: Response,
): Promise<void> {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  const result = await registerUser({ name, email, password });

  if (result === null) {
    res.redirect("/login");
    return;
  }

  switch (result.code) {
    case "duplicate_email":
      res.status(400).send({
        message: "This email is already associated with an account",
      });
      return;
    case "duplicate_username":
      res.status(400).send({
        message: "This username is already taken",
      });
      return;
    case "unknown":
      res.status(400).send({
        message: `Failed To Register User.<br>${result.message}`,
      });
      return;
  }
}

export function renderLogin(req: Request, res: Response): void {
  const { userAuthenticated } = req.session.user ?? {};

  if (userAuthenticated) {
    res.redirect("/");
    return;
  }

  res.render("./pages/login");
}

export async function postLogin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const result = await loginUser({ email, password });

    if ("user" in result) {
      req.session.user = result.user;
      res.redirect("/");
      return;
    }

    res.status(400).send({ message: "Invalid email or password" });
  } catch (error) {
    next(error);
  }
}

export function logout(req: Request, res: Response, next: NextFunction): void {
  try {
    req.session.destroy(() => {
      res.redirect("/");
    });
  } catch (error) {
    next(error);
  }
}
