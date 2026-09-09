## Why

The repository currently has no application code — only a LICENSE and OpenSpec tooling. We need a foundational Express + TypeScript API skeleton with a proper folder architecture (not a single `main.ts`) so future features have a consistent place to live: routing, controllers, services, middleware, config, and error handling.

## What Changes

- Initialize a Node.js/TypeScript project (`package.json`, `tsconfig.json`) with Express as the HTTP framework.
- Add a layered folder structure under `src/`: `config/`, `routes/`, `controllers/`, `services/`, `middlewares/`, `types/`, and an app bootstrap file separate from the server entrypoint (`app.ts` vs `server.ts`).
- Add centralized error handling middleware and a 404 handler.
- Add a health-check endpoint (`GET /health`) as the first working route, proving the wiring end-to-end.
- Add environment-based configuration loading (e.g., `PORT`) via a `config` module.
- Add base dev tooling: TypeScript build/watch scripts, ESLint, and `.gitignore` for `node_modules`/`dist`.
- Add a `.env.example` file documenting expected environment variables.

## Capabilities

### New Capabilities
- `api-foundation`: Base Express + TypeScript project structure, application bootstrap, configuration loading, routing/controller/service layering, centralized error handling, and the health-check endpoint.

### Modified Capabilities
(none — greenfield repository)

## Impact

- New files under `src/` (application code), root-level `package.json`, `tsconfig.json`, `.eslintrc`, `.gitignore`, `.env.example`.
- No existing code is modified since none exists yet.
- Establishes the architectural pattern that all future API capabilities will extend.
