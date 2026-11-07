import { performance } from "node:perf_hooks";
import { logger } from "../utils/logger.js";

export function requestLogger(req, res, next) {
  const started = performance.now();

  res.once("finish", () => {
    const durationMs = Number((performance.now() - started).toFixed(1));
    logger.info("HTTP request", {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs,
    });
  });

  next();
}
