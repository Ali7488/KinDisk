import { Router } from "express";
import { getHealth } from "../controllers/health.controller.js";
import { userRouter } from "./user.route.js";

export const apiRouter = Router();

apiRouter.get("/health", getHealth);
apiRouter.use("/user", userRouter);
