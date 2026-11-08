// Throw these from routes/services to send a specific status and message:
//   throw new HttpError(404, "User not found");
//   throw new HttpError(409); // message defaults to "Conflict"
import { STATUS_CODES } from "node:http";

export class HttpError extends Error {
  constructor(status = 500, message, options = {}) {
    super(message || STATUS_CODES[status] || "Error", { cause: options.cause });
    this.name = "HttpError";
    this.status = status;
    // 5xx messages are hidden from clients in production unless expose: true.
    this.expose = options.expose ?? status < 500;
  }
}
