# React + Express Starter (JavaScript)

Minimal reusable GitHub template with React 19, Vite 8, Express 5, and Yarn 4 workspaces. **JavaScript only**, no TypeScript, database, auth, or frontend routing preinstalled.

## Requirements

- Node.js 24 (see `.nvmrc`)
- Corepack / Yarn 4.18.0 (`corepack enable` if necessary)

## First run

```bash
corepack enable
yarn install
yarn dev
```

Open http://localhost:5173. The React page should show **API connected**. The Express endpoint is http://localhost:8000/api/health.

Local ports: 5173 (React/Vite), 8000 (Express).

## Structure

```text
client/   React frontend; client/src/App.jsx
server/   Express API; server/src/app.js and routes/
```

## Scripts

| Command | Action |
|---|---|
| `yarn dev` | Run frontend + backend concurrently |
| `yarn dev:client` | Run Vite |
| `yarn dev:server` | Run Express with Node's watcher |
| `yarn build` | Build the client |
| `yarn start` | Start only Express |

## Configuration and API flow

The Vite dev server proxies browser requests beginning with `/api` to Express at `http://localhost:8000`. The sample React component calls `/api/health` and displays a connection status. No CORS middleware is required for this development path. In production, use a reverse proxy or another intentional same-origin configuration, or configure CORS appropriately if deployed to different origins.

The backend API is mounted at `/api` and returns JSON. Add domain routes to `server/src/routes`, request handlers to `controllers`, and business rules to `services` when needed. Avoid creating extra layers without a purpose.

To set a custom server port, copy `server/.env.example` to `server/.env` and edit `PORT`. Also change the development proxy's port in `client/vite.config.js` if needed. Do not commit `.env`.

## Adding PostgreSQL / Prisma to a specific project

The base template deliberately does **not** install a database ORM or ship database credentials. When you need PostgreSQL and Prisma, install and initialize those **inside `server/`**, add `.env.example` (e.g. `DATABASE_URL`), and keep the generated client, migrations, and schema server-side. Prisma's setup is version-sensitive: follow current official Prisma docs rather than assuming an old generator configuration is universal.

## Turn this into a private GitHub template

From this directory, after installing and verifying locally:

```bash
git init -b main
git add .
git commit -m "chore: create React Express starter"
gh repo create Ali7488/react-express-template --private --source=. --remote=origin --push
gh api -X PATCH repos/Ali7488/react-express-template -F is_template=true
```

These require GitHub CLI (`gh`) authenticated to the account. If the repository already exists, use ordinary Git push instead of `gh repo create`.

## Create a new app from template

```bash
gh repo create Ali7488/kindisk --private --template Ali7488/react-express-template --clone
cd kindisk
yarn install
yarn dev
```

See the separate `mkfullstack.sh` function supplied with this starter for a reusable shell shortcut. The new repository has its own history and remote.

## Before real deployment

Add testing, input validation, production hosting configuration, security controls, database setup, and any required authentication **for your particular application**. The sample health endpoint is not a finished production API.
