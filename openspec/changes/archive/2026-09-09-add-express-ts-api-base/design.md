## Context

Greenfield repository (see proposal.md - Why). No existing tooling, package manager, or code conventions are established, so this design also fixes the baseline toolchain.

## Goals / Non-Goals

**Goals:**
- Establish a folder structure that scales past a single `main.ts` as more routes/capabilities are added.
- Keep the layering conventional (route → controller → service) so future OpenSpec changes have an obvious place to add code.
- Minimal but real dev ergonomics: type checking, build, watch mode, linting.

**Non-Goals:**
- No database/ORM integration yet (no persistence requirement exists).
- No authentication/authorization (out of scope until a capability requires it).
- No test framework wiring beyond what's needed to keep the base buildable (test strategy can be introduced in a later change).

## Decisions

**Folder structure**
```
src/
  app.ts              # Express app construction (middleware, routes) - no listen()
  server.ts           # Entrypoint: imports app, calls listen()
  config/
    index.ts          # Reads env vars, exposes typed config object with defaults
  routes/
    index.ts          # Aggregates and mounts all route modules
    health.route.ts   # GET /health
  controllers/
    health.controller.ts
  services/
    health.service.ts
  middlewares/
    error-handler.ts  # Centralized error handler
    not-found.ts       # 404 handler
  types/
    (shared TS types, e.g. ApiError)
```
Rationale: separating `app.ts` from `server.ts` lets tests import the Express app without binding a port, and keeps the entrypoint a thin bootstrap. Route/controller/service split matches the layering required by the `api-foundation` spec.

**Language/runtime tooling**: TypeScript compiled via `tsc`, `ts-node-dev` (or `tsx`) for the dev watch script, plain `node dist/server.js` for the compiled start script. Chosen over a bundler (esbuild/webpack) because a bundler adds complexity not justified for a base API skeleton — can be introduced later if needed.

**Config module**: a single `src/config/index.ts` reading `process.env` with defaults (e.g. `PORT` defaults to `3000`), rather than scattering `process.env` reads across files. Centralizes the "Environment-Based Configuration" requirement and gives one place to extend later.

**Error handling**: Express error-handling middleware (4-arg signature) registered last in `app.ts`, plus a catch-all 404 middleware registered just before it. Both return a consistent `{ error: { message } }` JSON shape. Chosen over per-route try/catch to satisfy the spec's centralized error handling requirement with a single implementation point.

**Linting**: ESLint with the TypeScript plugin, minimal ruleset (no stylistic/formatter opinions beyond defaults) — enough to catch obvious mistakes without bikeshedding style in a base scaffold.

## Risks / Trade-offs

- [Chosen layering may feel like over-structuring for a single `/health` route] → Mitigated by the explicit proposal requirement to avoid a single-file `main.ts`; the structure is intentionally sized for near-term growth, not the current one endpoint.
- [No test framework included] → Acceptable for this base scaffold; a follow-up change can add one once real business logic exists to test.
