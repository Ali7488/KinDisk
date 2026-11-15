import { Router } from "express";
import { contentHandler } from "../controllers/contents.controller.js";

export const userRouter = Router();

userRouter.get("/contents", contentHandler);
