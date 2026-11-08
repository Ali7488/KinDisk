import { Pool } from "pg";
import { logger } from "../utils/logger.js";
import { readConfig } from "./env";
const config = readConfig();

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (error) => {
  logger.error("Unexpected PostgreSQL pool error", { message: error.message });
});
