import { Router } from "express";
import { putVisit } from "./visit.controller.js";

export const visitRouter = Router();

visitRouter.put("/blogs/:blogId/visit", putVisit);
