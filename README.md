# KinDisk

KinDisk scaffold using **React + Vite**, **Express 5**, **Yarn 4 workspaces**, and JavaScript. It intentionally omits authentication, a database, and routing libraries until each project's needs are known.

## Requirements and first run

Node 24 (see `.nvmrc`), Corepack, and Yarn 4:

```bash
corepack enable
yarn install
yarn dev
```

Open **http://localhost:3000**. Express runs at **http://127.0.0.1:8000** with `GET /api/health`. Startup diagnostics and request logs appear in the backend terminal.

## Structure

```text
client/
  public/favicon.svg
  src/assets/
  src/styles/tokens.css     Dark/light palettes and design tokens
  src/styles/global.css     Reset and base element styling
  src/App.css               Starter page-only styles
  src/App.jsx               React app and API health check
  src/App.test.jsx          React integration smoke tests
  src/test/setup.js         Vitest matchers
  .env.example              CLIENT_PORT and API_PROXY_TARGET
  vite.config.js
server/
  src/app.js                Middleware and route assembly
  src/server.js          Server startup and diagnostics
  src/config/env.js         Validate HOST, PORT, and LOG_LEVEL
  src/routes/               API route definitions
  src/controllers/          Request handlers
  src/services/             Business logic when needed
  src/repositories/         Data persistence modules when needed
  src/middleware/           Request logging, 404, and error handling
  src/utils/logger.js       Timestamped structured log output
  src/test/                 Node built-in test runner
  .env.example
.github/workflows/ci.yml    Checks pushes to all branches and PRs
eslint.config.js
prettier.config.js
```

## Commands

| Command             | Description                           |
| ------------------- | ------------------------------------- |
| `yarn dev`          | Start Vite and Express simultaneously |
| `yarn lint`         | Run ESLint on client and server       |
| `yarn format`       | Format with Prettier                  |
| `yarn format:check` | Verify formatting                     |
| `yarn test`         | Run React and Express tests           |
| `yarn build`        | Build frontend                        |
| `yarn check`        | Lint, format-check, test, and build   |

## Design system

The default dark palette is charcoal and gold. If the OS prefers light mode, the application uses white and gold. All defaults are in `client/src/styles/tokens.css`, with semantic color variables, fonts, font-size scale, spacing, radii, shadows, container widths, and motion settings.

The project bundles **Manrope Variable** (sans serif) and **Fraunces Variable** (serif) using Fontsource and Vite; no remote runtime font requests. For a manual theme override, set `document.documentElement.dataset.theme = "light"` or `"dark"`; delete that attribute to follow the OS again. The favicon under `client/public/` is a replaceable placeholder.

## Development environment

Copy `client/.env.example` to `client/.env` to change `CLIENT_PORT` or `API_PROXY_TARGET`. Copy `server/.env.example` to `server/.env` to change `HOST`, `PORT`, or `LOG_LEVEL`.

When changing the server port, also change the client's `API_PROXY_TARGET`. The Vite proxy avoids CORS configuration in local same-origin development. Do not put secrets into client-side `VITE_*` variables. Private `.env`, local settings, editor folders, dependency folders, and build output are Git-ignored.

## CI

GitHub Actions runs on every push (including feature branches) and every pull request. It installs Yarn workspaces and runs ESLint, Prettier checks, client/server tests, and the frontend build. The committed `yarn.lock` pins dependencies. CI uses `yarn install --immutable` and rejects dependency changes that do not include the matching lockfile update.

## Project development

KinDisk's feature implementation belongs here. Shared scaffold improvements can be cherry-picked from the reusable template, but future template changes will not automatically modify this repository.

## Adding a database

When required, add Prisma/PostgreSQL inside `server/`; do not connect React to PostgreSQL directly.
