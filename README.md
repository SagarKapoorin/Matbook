# Matbook Studio – Dynamic Form Builder

Matbook Studio is a small full‑stack app that showcases a **schema‑driven “Employee Onboarding” form** with **live validation** and a **submissions dashboard**.

- **Backend** – Node.js, Express, TypeScript, in‑memory storage  
- **Frontend** – React, TypeScript, Vite, Tailwind, TanStack Form/Query/Table  
- **Validation** – rules are defined once in a schema and enforced on both client and server

For detailed per‑package docs, see:

- `backend/README.md` – API, validation rules, schema details
- `frontend/README.md` – UI flow, components, and dev tooling

## Project Structure

- `backend/` – Express API, validation layer and in‑memory submissions store
- `frontend/` – React SPA for building the form UI and browsing submissions

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm (comes with Node)

## Getting Started

### 1. Start the backend API

From the repo root:

```bash
cd backend
npm install
npm run dev
```

The backend listens on the `PORT` environment variable (defaults to `3000` in `src/server.ts`) and exposes its routes under `/api` (for example, `http://localhost:3000/api/form-schema`).

For a production build:

```bash
npm run build
npm start
```

### 2. Start the frontend

In a second terminal, from the repo root:

```bash
cd frontend
npm install
npm run dev
```

By default, Vite serves the app at `http://localhost:5173`.

The frontend is currently configured to talk to the backend at:

- `http://localhost:3000/api` (see `frontend/src/api.ts`)

If you run the backend on a different host or port, update the `baseURL` in `frontend/src/api.ts` accordingly or introduce environment‑based configuration.

## High‑Level Flow

1. The frontend requests the form schema from `GET /api/form-schema`.
2. The schema is converted to UI fields and client‑side validation rules.
3. When a user submits the form, the frontend calls `POST /api/submissions`.
4. Valid submissions are stored in memory on the backend and can be listed via `GET /api/submissions`.
5. The Submissions page uses pagination and sorting to browse stored responses.

## Useful Links

- Backend docs: `backend/README.md`
- Frontend docs: `frontend/README.md`

