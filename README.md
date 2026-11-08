# KinDisk

## Requirements and first run

Node 24 (see `.nvmrc`), Corepack, and Yarn 4:

```bash
corepack enable
yarn install
yarn dev
```

Open **http://localhost:3000**. Express runs at **http://127.0.0.1:8000** with `GET /api/health`. Startup diagnostics and request logs appear in the backend terminal.

## Commands

| Command               | Description                                                   |
| --------------------- | ------------------------------------------------------------- |
| `yarn dev`            | Start Vite and Express simultaneously                         |
| `yarn lint`           | Run ESLint on client and server                               |
| `yarn format`         | Format with Prettier                                          |
| `yarn format:check`   | Verify formatting                                             |
| `yarn test`           | Run React and Express tests                                   |
| `yarn build`          | Build frontend                                                |
| `yarn template:check` | Show unconverted starter placeholders (exits 1 until cleared) |
| `yarn check`          | Lint, format-check, test, and build                           |

**Formatting:** `yarn format` runs ESLint autofixes (including adding `.js` to resolvable relative Node ESM imports) before Prettier. VS Code's standalone Prettier formatter does not rewrite import paths.

**Temporary frontend test policy:** until React functionality is implemented, Vitest allows zero discovered client test files. No placeholder tests are counted as passing; real tests must pass once added.
