import { app } from "./app.js";
import { readConfig } from "./config/env.js";
import { logger } from "./utils/logger.js";

try {
  const config = readConfig();
  logger.setLevel(config.logLevel);

  logger.info("Starting Express API", {
    node: process.version,
    pid: process.pid,
    environment: config.nodeEnv,
    host: config.host,
    port: config.port,
  });

  const server = app.listen(config.port, config.host);

  server.once("listening", () => {
    const address = `http://${config.host}:${config.port}`;
    logger.info("Express is listening", { address });
    logger.info("Health check available", { url: `${address}/api/health` });
    logger.info("API route prefix registered", { prefix: "/api" });
    logger.info("Frontend is served separately by Vite (default port 3000)");
    logger.info("Ready to accept requests");
  });

  server.once("error", (error) => {
    logger.error("Unable to start HTTP server", {
      code: error.code,
      message: error.message,
      host: config.host,
      port: config.port,
    });

    if (error.code === "EADDRINUSE") {
      logger.error("Port is already in use. Change PORT or stop the conflicting process.");
    } else if (error.code === "EACCES") {
      logger.error("Permission denied. Use an unprivileged PORT.");
    }

    process.exitCode = 1;
  });

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.once(signal, () => {
      logger.info("Shutdown requested", { signal });
      server.close((error) => {
        if (error) {
          logger.error("Shutdown failed", { message: error.message });
          process.exitCode = 1;
        } else {
          logger.info("HTTP server closed cleanly");
        }
      });
    });
  }
} catch (error) {
  logger.error("Server configuration or startup failed", {
    message: error.message,
    stack: error.stack,
  });
  process.exitCode = 1;
}
