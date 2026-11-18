# KinDisk

**A self-hosted file manager, built with React, Express, and PostgreSQL.**

KinDisk is a work-in-progress browser-based file manager intended for a small, trusted group. The long-term goal is private file storage and optional folder sharing on hardware the group controls. **Right now, the working vertical slice retrieves file and folder metadata from PostgreSQL and displays it in React.**

> **Project status:** Active development. Local prototype, not production-ready. The current records represent development data, not uploaded files.

## Current functionality

The implemented path runs from the browser to the database and back:

1. A React client requests `GET /api/user/contents`.
2. An Express route calls a controller and service layer.
3. The data-access layer queries PostgreSQL for folders and file metadata using the `pg` connection pool and parameterized queries.
4. The API responds with `folders` and `files` arrays.
5. The client renders separate tables with folder names, IDs, parent-folder references, file names, and sizes.

The UI handles **loading**, **empty lists**, **unexpected API responses**, **request failures**, and **manual retry**. Request cancellation avoids applying results after a fetch has been aborted.

Other implemented foundations:

- **Relational schema:** users, folders, files, folder-access permissions, and instance settings, with UUID keys, references, validation constraints, and a permission enum.
- **Versioned SQL migrations:** handwritten PostgreSQL migrations managed through dbmate.
- **Reproducible local database:** PostgreSQL 18 via Docker Compose, development seeds, and reset scripts.
- **Basic API health check:** `GET /api/health`.
- **Automated tests:** React Testing Library/Vitest coverage for the content view and error/retry states, plus Node tests for backend configuration and health routes.

### API example

`GET http://127.0.0.1:8000/api/user/contents`

The response uses the following shape (illustrative values):

```json
{
  "folders": [
    {
      "folder_id": "folder-a",
      "folder_name": "University",
      "parent_folder_id": null
    }
  ],
  "files": [
    {
      "file_id": "file-a",
      "file_name": "lecture.pdf",
      "files_parent": "folder-a",
      "storage_used": "4200000",
      "owner_id": "user-a"
    }
  ]
}
```

The API currently uses a **hard-coded seeded development user**. It does **not** authenticate requests, return hierarchical folder trees, or serve real file bytes. The database seed creates metadata and placeholder storage keys only.

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, JavaScript |
| API | Node.js, Express |
| Data | PostgreSQL, handwritten SQL, `pg`, dbmate |
| Local infrastructure | Docker Compose |
| Tests | Vitest, React Testing Library, Node test runner |
| Workspace | Yarn 4 workspaces |

## Run locally

You need **Node.js 24+**, **Yarn 4**, and **Docker with Compose**.

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/Ali7488/KinDisk.git
   cd KinDisk
   corepack enable
   yarn install
   ```

2. Copy `.env.example` to `.env` and `server/.env.example` to `server/.env`. Set your local PostgreSQL credentials and ensure `KINDISK_*` values in the root environment match the corresponding `DB_*` values in the server environment. Do **not** commit your real `.env` files.

3. Start the database, migrate, and populate the development records:

   ```bash
   docker compose up -d
   yarn db:migrate
   yarn db:seed
   ```

   **Warning:** `yarn db:seed` resets and replaces the *development* records. Never run it against a database containing data you need to keep.

4. Start the API and frontend:

   ```bash
   yarn dev
   ```

Open **http://localhost:3000** for the React client. The API defaults to **http://127.0.0.1:8000**. Vite proxies `/api` requests to the backend during development.

### Tests and code checks

```bash
yarn test            # client and server tests
yarn lint            # ESLint
yarn build           # frontend production build
yarn check           # lint, formatting, tests, and build
```

## Roadmap

| Milestone | Status |
| --- | --- |
| PostgreSQL schema, migrations, development seed | Implemented |
| Metadata retrieval API and React listing view | Implemented |
| Real folder navigation and hierarchy | In progress |
| Real file upload, download, and filesystem storage | Planned for V1 |
| Authentication and private user sessions | Planned for V2 |
| Sharing permissions, quotas, and secure self-hosted access | Planned for V2 |

## Scope and security

**This is a local development prototype, not a secure cloud drive.** It has no user authentication and currently selects a fixed development identity. Do not expose the API to the public internet, rely on the current permission tables for access control, or store sensitive files in this version. File uploads, downloads, and actual file storage are not implemented yet.

The repository is public so reviewers can inspect the design decisions and code. V1 is intended to run locally rather than as a hosted demo.
