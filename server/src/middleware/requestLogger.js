import { performance } from "node:perf_hooks";
import { logger } from "../utils/logger.js";

export function requestLogger(req, res, next) {
  const started = performance.now();

  res.once("finish", () => {
    const durationMs = Number((performance.now() - started).toFixed(1));
    const status = res.statusCode;
    const level = status >= 500 ? "error" : status >= 400 ? "warn" : "info";
    const stream = level === "info" ? process.stdout : process.stderr;

    logger[level](`${req.method} ${req.originalUrl} ${logger.status(status, stream)}`, {
      durationMs,
    });
  });

  next();
}
