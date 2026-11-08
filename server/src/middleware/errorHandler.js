import { STATUS_CODES } from "node:http";
import { logger } from "../utils/logger.js";

const isProduction = process.env.NODE_ENV === "production";

function resolveStatus(error) {
  const status = Number(error?.status ?? error?.statusCode);
  return Number.isInteger(status) && status >= 400 && status <= 599 ? status : 500;
}

// Handles HttpError, Express/body-parser errors (400 bad JSON, 413 too large), and anything thrown.
// Response: { status, error } with the supplied message, or the standard status text as default.
export function errorHandler(error, req, res, _next) {
  const status = resolveStatus(error);
  const fallback = STATUS_CODES[status] ?? "Error";
  const supplied = typeof error?.message === "string" && error.message.trim() ? error.message : "";

  // Client errors show their message. Server errors only do outside production (or with expose: true).
  const canShow = error?.expose === true || status < 500 || !isProduction;
  const message = canShow && supplied ? supplied : fallback;

  const context = {
    method: req.method,
    path: req.originalUrl,
    status,
    message: supplied || fallback,
  };
  // The request logger already prints a colored line per request; this adds the why.
  if (status >= 500) {
    logger.error("Request failed", { ...context, stack: error?.stack });
  } else {
    logger.debug("Request rejected", context);
  }

  if (res.headersSent) return;

  res.status(status).json({ status, error: message });
}
