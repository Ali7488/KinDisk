import assert from "node:assert/strict";
import { test } from "node:test";
import { readConfig } from "../config/env.js";

test("config uses documented ports and safe localhost binding", () => {
  const config = readConfig({});
  assert.equal(config.port, 8000);
  assert.equal(config.host, "127.0.0.1");
  assert.equal(config.logLevel, "info");
});

test("config rejects invalid ports and log levels", () => {
  assert.throws(() => readConfig({ PORT: "abc" }), /Invalid PORT/);
  assert.throws(() => readConfig({ PORT: "65536" }), /Invalid PORT/);
  assert.throws(() => readConfig({ LOG_LEVEL: "verbose" }), /Invalid LOG_LEVEL/);
});
