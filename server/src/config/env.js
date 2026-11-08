const allowedLevels = new Set(["debug", "info", "warn", "error"]);

export function readConfig(env = process.env) {
  const rawPort = env.PORT ?? "8000";
  const port = Number(rawPort);

  if (!/^\d+$/.test(rawPort) || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("Invalid PORT: expected an integer between 1 and 65535");
  }

  const host = env.HOST?.trim() || "127.0.0.1";
  const nodeEnv = env.NODE_ENV?.trim() || "development";
  const logLevel = (env.LOG_LEVEL || "info").toLowerCase();

  if (!allowedLevels.has(logLevel)) {
    throw new Error("Invalid LOG_LEVEL: expected debug, info, warn, or error");
  }

  const dbHost = env.DB_HOST?.trim() || "127.0.0.1";
  const rawDbPort = env.DB_PORT ?? "";
  const dbPort = Number(rawDbPort);

  if (!/^\d+$/.test(rawDbPort) || !Number.isInteger(dbPort) || dbPort < 1 || dbPort > 65535) {
    throw new Error("Invalid DB_PORT: expected an integer between 1 and 65535");
  }

  for (const key of ["DB_NAME", "DB_USER", "DB_PASSWORD"]) {
    if (!env[key]?.trim()) {
      throw new Error(`${key} is required`);
    }
  }

  const db = Object.freeze({
    host: dbHost,
    port: dbPort,
    database: env.DB_NAME.trim(),
    user: env.DB_USER.trim(),
    password: env.DB_PASSWORD,
  });

  return Object.freeze({
    host,
    port,
    nodeEnv,
    logLevel,
    db,
  });
}
