# KinDisk

KinDisk application scaffold.

## Requirements

- Node.js 24 (see `.nvmrc`)
- Corepack and Yarn 4
- JavaScript, not TypeScript

## Start

```bash
corepack enable
yarn install
yarn dev
```

Open http://localhost:5173. The React page checks `/api/health` on the Express backend at http://localhost:8000.

## Project layout

```text
client/
  public/favicon.svg   Public favicon; replace for your app
  src/assets/          Bundled/imported assets
  src/App.jsx          React app and API connection check
  src/App.css          Component-level starter styles
  src/index.css        Global styles
  index.html           HTML entry point and favicon link
  vite.config.js       React plugin and /api proxy
server/
  src/app.js           Express middleware and API registration
  src/index.js         Server start
  src/routes/          Express API routes
  src/controllers/     Route handlers
  src/services/        Feature-dependent business logic
  .env.example         Documented server configuration
eslint.config.js       Client browser + server Node linting
prettier.config.js     Shared formatting
.editorconfig          Editor-neutral whitespace rules
```

## Commands

| Command | Purpose |
| --- | --- |
| `yarn dev` | Run frontend and backend |
| `yarn dev:client` | Run Vite only |
| `yarn dev:server` | Run Express only |
| `yarn build` | Build frontend |
| `yarn start` | Start Express only |
| `yarn lint` | Check JavaScript and JSX |
| `yarn lint:fix` | Apply safe ESLint fixes |
| `yarn format` | Apply Prettier formatting |
| `yarn format:check` | Check formatting |
| `yarn check` | Lint, formatting check, and build |

Run `yarn format` after installing dependencies before the first `yarn format:check` if formatting differences exist.

## Assets and favicon

- Put files referenced by fixed URLs in `client/public/` (e.g. `/favicon.svg`).
- Put imported images and other bundled assets in `client/src/assets/`.
- Edit `client/index.html` to change the page title, icon, and metadata.
- The supplied favicon is a neutral placeholder, not app branding.

## Configuration

Vite proxies `/api` to Express at `http://localhost:8000` during development. No CORS dependency is required for this local setup. For production, configure hosting and cross-origin behavior deliberately.

Copy `server/.env.example` to `server/.env` for server-only settings. Files matching `.env*`, `*.local`, `.local/`, `.vscode/`, and `.zed/` are ignored where appropriate. Commit `.env.example`, never real secrets. Browser-exposed `VITE_*` values are public.

The starter intentionally does not include a database, authentication, React Router, or Tailwind. Add these per application needs. PostgreSQL and Prisma should remain server-side.

## Project-specific development

Keep KinDisk-specific features in this repository. Updates to the reusable starter should be brought in selectively, not merged blindly.

