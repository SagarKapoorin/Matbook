# Dynamic Form Builder Backend (Node.js + TypeScript)

This backend powers a dynamic "Employee Onboarding" form using a clean, layered architecture with in-memory storage only.

## Tech Stack

- Node.js
- Express
- TypeScript
- In-memory storage (JavaScript array) – no database

## Project Structure

`backend/src`

- `server.ts` – App entrypoint (Express, middleware, error handling, route mounting)
- `routes/`
  - `index.ts` – Mounts all API routes under `/api`
  - `formRoutes.ts` – Routes for form schema (`/api/form-schema`)
  - `submissionRoutes.ts` – Routes for submissions (`/api/submissions`)
- `controllers/`
  - `submissionController.ts` – HTTP controllers for create/list/delete submissions
- `services/`
  - `validationService.ts` – Dynamic validation against the form schema
  - `submissionService.ts` – In-memory submission store and business logic
- `schemas/`
  - `formSchema.ts` – Static JSON schema for "Employee Onboarding"
- `types/`
  - `index.ts` – Shared TypeScript interfaces and types

## Form Schema

Defined in `src/schemas/formSchema.ts` as `"Employee Onboarding"` with fields:

1. `fullName` (text) – required, minLength 2, regex `^[a-zA-Z\s]*$`
2. `age` (number) – required, min 18, max 65
3. `department` (select) – required, options: `HR`, `Engineering`, `Marketing`
4. `skills` (multi-select) – options: `React`, `Node`, `Python`, `Java`, minSelected 1, maxSelected 3
5. `dateOfJoining` (date) – required, minDate = today
6. `bio` (textarea) – maxLength 200
7. `termsAccepted` (switch) – required and must be `true`

## Validation Logic

The validation is dynamic and schema-driven:

- Implemented in `src/services/validationService.ts`
- Iterates over `formSchema.fields`
- Supports:
  - `required` (including special handling for switches: must be `true`)
  - `minLength`, `maxLength`, `pattern` (regex) for text/textarea
  - `min`, `max` for numbers
  - Options checking for select and multi-select
  - `minSelected`, `maxSelected` for multi-select
  - `minDate` (`"today"` or fixed date) for dates

On validation failure, the API returns:

```json
{
  "fieldName": "Error message"
}
```

## In-Memory Storage

Submissions are stored in memory for the lifetime of the server:

- Type: `Submission { id: string; createdAt: string; data: Record<string, any> }`
- Implemented in `src/services/submissionService.ts`
- No database or file-based persistence is used

## API Endpoints

Base URL: `http://localhost:4000/api` (by default)

### 1. Get Form Schema

`GET /api/form-schema`

Response:

```json
{
  "success": true,
  "schema": { ... }
}
```

### 2. Create Submission

`POST /api/submissions`

Body:

```json
{
  "fullName": "John Doe",
  "age": 30,
  "department": "Engineering",
  "skills": ["React", "Node"],
  "dateOfJoining": "2025-11-28",
  "bio": "Some text here",
  "termsAccepted": true
}
```

Success response (`201`):

```json
{
  "success": true,
  "id": "generated-uuid",
  "createdAt": "2025-11-28T10:00:00.000Z"
}
```

Validation error response (`400`):

```json
{
  "fullName": "Full Name is required."
}
```

### 3. List Submissions (Pagination + Sorting)

`GET /api/submissions`

Query params:

- `page` (default: `1`)
- `limit` (default: `10`)
- `sortBy` (default: `createdAt`)
- `sortOrder` (default: `desc`, or `asc`)

Example:

`GET /api/submissions?page=1&limit=10&sortBy=createdAt&sortOrder=desc`

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "createdAt": "2025-11-28T10:00:00.000Z",
      "data": {
        "fullName": "John Doe",
        "age": 30,
        "department": "Engineering",
        "skills": ["React", "Node"],
        "dateOfJoining": "2025-11-28",
        "bio": "Some text here",
        "termsAccepted": true
      }
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "totalPages": 1
  }
}
```

### 4. Delete Submission

`DELETE /api/submissions/:id`

Success (`204`): empty response body.

Not found (`404`):

```json
{
  "id": "Submission not found"
}
```

## Environment Variables

- `PORT` (optional) – defaults to `4000`

No other environment variables are required.

## Running the Backend

From the `backend` directory:

```bash
npm install
npm run dev
```

Build and run in production mode:

```bash
npm run build
npm start
```

Made by Sagar Kapoor sagarbadal70@gmail.com

