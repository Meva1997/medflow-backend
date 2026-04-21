# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with hot-reload (ts-node-dev)
npm run start    # Start server without hot-reload
npm run seed     # Drop all tables, recreate schema, and populate with faker data
```

No test runner is configured yet (`npm test` exits with error).

## Environment

Copy `.env.example` to `.env`. Required variables: `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST` (default `127.0.0.1`), `DB_PORT` (default `5432`), `PORT` (default `3000`).

The app exits at startup if the database connection fails.

## Architecture

**Entry point:** `src/index.ts` — boots Express, authenticates Sequelize, registers `cors` + `express.json()`, mounts `/api/patients`, and attaches the `errorHandler` as the final middleware.

**Request lifecycle:** Route → validator chain (express-validator) → `validate` middleware (short-circuits on errors with `400`) → controller (catches and calls `next(error)`) → `errorHandler` (maps Sequelize `UniqueConstraintError` → 409, `ValidationError` → 400, `err.status` → that status, else 500).

**Models:** `Patient` and `VitalSigns` are Sequelize v6 classes with typed `PatientAttributes` / `VitalSignsAttributes` interfaces. Both use UUID PKs and `underscored: true` (camelCase in code, snake_case in DB). Associations are declared in `src/models/index.ts`; always import models from there, not directly, to ensure associations are registered.

**Routing:** Vital signs are nested under patients via `router.use("/:patientId/vitals", vitalSignsRouter)` in `patient.routes.ts`. Express mergeParams is used in `vitalSigns.routes.ts` to access `:patientId`.

**Validation:** Each resource has a dedicated `src/validators/*.validators.ts` file exporting arrays of `express-validator` chain rules. The shared `validate` middleware in `src/middleware/validate.ts` converts failures into `{ errors: [...] }` responses.

**Non-standard REST pattern:** `GET /api/patients/:id` is implemented as `POST /api/patients/find` with `{ id }` in the request body.
