import express from "express";
import { requestLogger } from "./middleware/requestLogger.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiRouter } from "./routes/index.js";

export const app = express();

app.use(requestLogger);
app.use(express.json());
app.use("/api", apiRouter);

app.use(notFound);
app.use(errorHandler);
