# Matbook Studio – Dynamic Form Builder

Matbook Studio is a small full-stack app that showcases a **schema-driven "Employee Onboarding" form** with **live validation** and a **submissions dashboard**.

- **Backend** – Node.js, Express, TypeScript, in-memory storage for submissions, Redis-backed rate limiting  
- **Frontend** – React, TypeScript, Vite, Tailwind, TanStack Form/Query/Table  
- **Validation** – rules are defined once in a schema and enforced on both client and server

For detailed per-package docs, see:

- `backend/README.md` – API, validation rules, schema details, rate limiting and environment variables
- `frontend/README.md` – UI flow, components, and dev tooling

## Project Structure

- `backend/` – Express API, validation layer, in-memory submissions store, Redis-backed rate limiter
- `frontend/` – React SPA for building the form UI and browsing submissions

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm (comes with Node)
- Redis / Redis Stack (for rate limiting)

## Getting Started

### 1. Configure environment variables

From the repo root:

```bash
cd backend
cp .env.example .env
```

Then adjust:

- `PORT` – backend HTTP port (default `3000`)
- `CORS_ORIGIN` – your frontend origin(s), e.g. `http://localhost:5173`
- `REDIS_URL` – Redis connection string used for rate limiting, e.g. `redis://localhost:6379`

### 2. Start the backend API

From the `backend` directory:

```bash
npm install
npm run dev
```

The backend listens on `PORT` and exposes its routes under `/api` (for example, `http://localhost:3000/api/form-schema`).

For a production build:

```bash
npm run build
npm start
```

### 3. Start the frontend

In a second terminal, from the repo root:

```bash
cd frontend
npm install
npm run dev
```

By default, Vite serves the app at `http://localhost:5173`.

The frontend is currently configured to talk to the backend at:

- `http://localhost:3000/api` (see `frontend/src/api.ts`)

If you run the backend on a different host or port, update the `baseURL` in `frontend/src/api.ts` accordingly or introduce environment-based configuration.

## High-Level Flow

1. The frontend requests the form schema from `GET /api/form-schema`.
2. The schema is converted to UI fields and client-side validation rules.
3. When a user submits the form, the frontend calls `POST /api/submissions`.
4. Valid submissions are stored in memory on the backend and can be listed via `GET /api/submissions`.
5. The Submissions page uses pagination and sorting to browse stored responses.

## Useful Links

- Backend docs: `backend/README.md`
- Frontend docs: `frontend/README.md`

