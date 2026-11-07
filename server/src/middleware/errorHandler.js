import { logger } from "../utils/logger.js";

export function errorHandler(error, req, res, _next) {
  logger.error("Unhandled request error", {
    method: req.method,
    path: req.originalUrl,
    message: error.message,
  });

  if (res.headersSent) return;

  res.status(500).json({ error: "Internal server error" });
}
