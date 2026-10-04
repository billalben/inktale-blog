import { Router } from "express";
import { deleteReaction, putReaction } from "./reaction.controller.js";

export const reactionRouter = Router();

reactionRouter.put("/blogs/:blogId/reactions", putReaction);
reactionRouter.delete("/blogs/:blogId/reactions", deleteReaction);
