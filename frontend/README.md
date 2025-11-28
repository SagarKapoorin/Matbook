# Matbook Studio Frontend (React + TypeScript)

This is the **React SPA** for Matbook Studio – a **schema‑driven “Employee Onboarding” form** with live validation and a submissions dashboard.

The UI consumes the backend schema and submissions API and renders:

- A dynamic form that adapts to the server‑defined fields and rules
- Real‑time client‑side validation aligned with server validation
- A paginated, sortable submissions table with per‑submission detail view

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query (server state + caching)
- TanStack Form (form state and field APIs)
- TanStack Table (submissions table)
- Axios (HTTP client)

## App Structure

Key files:

- `src/main.tsx` – React + router + app bootstrap
- `src/App.tsx` – Shell layout, navigation between **Form** and **Submissions**
- `src/api.ts` – Typed API client, schema + submissions types and adapters
- `src/pages/FormPage.tsx` – Dynamic form:
  - Fetches schema from the backend
  - Builds field‑level validators from the schema
  - Uses TanStack Form for state and validation
  - Calls `createSubmission` on submit and redirects to **Submissions**
- `src/pages/SubmissionsPage.tsx` – Submissions dashboard:
  - Uses TanStack Query + Table
  - Pagination, sorting by `createdAt`, loading/error states
  - Desktop table and mobile‑friendly list
- `src/components/FieldRenderer.tsx` – Renders a single field (text, textarea, select, multi‑select, number, date, switch) based on schema
- `src/components/ui/*` – Small headless/utility UI primitives (button, card, table, spinner, etc.)

## API and Configuration

The frontend talks to the backend through the Axios instance in `src/api.ts`:

- Base URL: `http://localhost:3000/api`

To point the app at a different backend:

1. Open `src/api.ts`.
2. Update the `baseURL` of the `axios.create` call.

You can also adapt this to use environment‑based configuration if needed.

Expected backend endpoints (see `backend/README.md` for full details):

- `GET /api/form-schema` – returns the dynamic form schema
- `POST /api/submissions` – validates + stores a submission
- `GET /api/submissions` – paginated submissions list

## Running the Frontend

From `frontend/`:

```bash
npm install

# Start dev server
npm run dev

# Type‑check + build for production
npm run build

# Preview the production build locally
npm run preview
```

By default, Vite serves the app at `http://localhost:5173`.

## Development Notes

- Client‑side validators in `FormPage.tsx` are derived directly from the backend schema so the UX stays in sync with server rules.
- Whenever a submission is created, the **Submissions** query cache is invalidated so the list stays up‑to‑date without manual refresh.
- Styling is done with Tailwind utility classes for quick iteration; you can layer a design system on top if desired.

