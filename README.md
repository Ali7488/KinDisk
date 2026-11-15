# KinDisk

**Status: In development. Not production-ready.**

KinDisk is a self-hosted, browser-based file manager for a household or small trusted group. The goal is to give each person a private drive on a server they control, with optional folder sharing between accounts.

The stack is **React + Vite**, **Node.js + Express (JavaScript)**, **PostgreSQL** with handwritten SQL via `pg`, and host filesystem storage for file contents.

## Progress

- **Implemented:** PostgreSQL schema, migrations and development seed; Express API with a health check and `GET /api/user/contents`, which retrieves flat folder and file metadata for a seeded development user.
- **V1 (in progress):** Local-only file manager with folder navigation, hierarchy and real file upload/download. The source will be public; the application will not be hosted for V1.
- **V2 (planned):** Authentication, account management, private multi-user drives, folder permissions/sharing, storage quotas and a deployable self-hosted setup with private Tailscale access.

**The current API uses a temporary development identity, not authentication. Do not expose this prototype to a network or store sensitive files in it.**

## Local development

Requires Node.js 24, Yarn 4, Docker, and local environment configuration based on `.env.example` and `server/.env.example`. Start PostgreSQL with Docker Compose and apply the migrations before using database-backed routes.

```bash
corepack enable
yarn install
docker compose up -d
yarn db:migrate
yarn dev
```

The client runs at `http://localhost:3000` and the API at `http://127.0.0.1:8000`. `yarn db:seed` resets and reloads **development data only**.

*A full project README, installation guide and architecture documentation will be written as the application reaches V1.*
