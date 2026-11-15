import assert from "node:assert/strict";
import { after, before, test } from "node:test";
// The app imports database-backed routes, which initialize pg configuration.
// These routes are not exercised in this health test; no database is contacted.
Object.assign(process.env, {
  DB_PORT: "5435",
  DB_NAME: "kindisk_test",
  DB_USER: "test_user",
  DB_PASSWORD: "test-only-placeholder",
});

// Dynamic import ensures test config exists before db.js calls readConfig().
const { app } = await import("../app.js");

let server;
let baseUrl;

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("GET /api/health returns a successful JSON response", async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("unknown API endpoints return JSON 404", async () => {
  const response = await fetch(`${baseUrl}/api/missing`);
  assert.equal(response.status, 404);
  assert.equal((await response.json()).status, 404);
});
