import assert from "node:assert/strict";
import { test } from "node:test";
import { readConfig } from "../config/env.js";

const validDbEnv = {
  DB_PORT: "5435",
  DB_NAME: "kindisk_test",
  DB_USER: "kindisk_app",
  DB_PASSWORD: "test-only-password",
};

test("config uses documented ports and safe localhost binding", () => {
  const config = readConfig(validDbEnv);
  assert.equal(config.port, 8000);
  assert.equal(config.host, "127.0.0.1");
  assert.equal(config.logLevel, "info");
  assert.deepEqual(config.db, {
    host: "127.0.0.1",
    port: 5435,
    database: "kindisk_test",
    user: "kindisk_app",
    password: "test-only-password",
  });
});

test("config rejects invalid HTTP ports and log levels", () => {
  assert.throws(() => readConfig({ ...validDbEnv, PORT: "abc" }), /Invalid PORT/);
  assert.throws(() => readConfig({ ...validDbEnv, PORT: "65536" }), /Invalid PORT/);
  assert.throws(() => readConfig({ ...validDbEnv, LOG_LEVEL: "verbose" }), /Invalid LOG_LEVEL/);
});

test("config requires valid database settings", () => {
  assert.throws(() => readConfig({}), /Invalid DB_PORT/);
  assert.throws(() => readConfig({ ...validDbEnv, DB_PORT: "0" }), /Invalid DB_PORT/);
  assert.throws(() => readConfig({ ...validDbEnv, DB_PORT: "abc" }), /Invalid DB_PORT/);
  assert.throws(() => readConfig({ ...validDbEnv, DB_NAME: "" }), /DB_NAME is required/);
  assert.throws(() => readConfig({ ...validDbEnv, DB_USER: " " }), /DB_USER is required/);
  assert.throws(() => readConfig({ ...validDbEnv, DB_PASSWORD: "" }), /DB_PASSWORD is required/);
});
