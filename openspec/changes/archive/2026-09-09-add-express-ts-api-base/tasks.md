## 1. Project Setup

- [x] 1.1 Initialize `package.json` and install Express, TypeScript, and type definitions (`@types/express`, `@types/node`); verify `npm install` completes with no errors
- [x] 1.2 Add `tsconfig.json` targeting Node/CommonJS (or ESM per team convention) with `src` as rootDir and `dist` as outDir; verify `npx tsc --noEmit` runs without configuration errors
- [x] 1.3 Add `.gitignore` covering `node_modules/`, `dist/`, and `.env`; verify `git status` no longer shows these paths as untracked after a build
- [x] 1.4 Add `.env.example` documenting `PORT`; verify the file lists all env vars consumed by `src/config`
- [x] 1.5 Add npm scripts: `build` (tsc), `start` (run compiled output), `dev` (watch mode), `lint`; verify each script runs successfully

## 2. Folder Structure & Configuration

- [x] 2.1 Create the `src/` layout from design.md (`config/`, `routes/`, `controllers/`, `services/`, `middlewares/`, `types/`); verify each directory exists with at least a placeholder or real file
- [x] 2.2 Implement `src/config/index.ts` reading `PORT` from `process.env` with a documented default; verify importing the module returns the default when `PORT` is unset and the env value when set

## 3. Application Bootstrap

- [x] 3.1 Implement `src/app.ts` constructing and exporting the Express app (JSON body parsing, mounted routes) without calling `listen()`; verify the module exports an Express `Application` instance
- [x] 3.2 Implement `src/server.ts` importing `app` and `config`, calling `listen(config.port)`; verify running `npm run dev` starts the server and logs the listening port

## 4. Health Check Endpoint

- [x] 4.1 Implement `src/services/health.service.ts` returning a status payload (e.g., `{ status: 'ok' }`); verify it returns the expected shape when called directly
- [x] 4.2 Implement `src/controllers/health.controller.ts` calling the health service and sending a 200 JSON response; verify it sends the service's payload with HTTP 200
- [x] 4.3 Implement `src/routes/health.route.ts` wiring `GET /health` to the controller, and mount it via `src/routes/index.ts` in `app.ts`; verify `curl localhost:<port>/health` returns HTTP 200 with the expected JSON body

## 5. Centralized Error Handling

- [x] 5.1 Implement `src/middlewares/not-found.ts` returning HTTP 404 with a JSON error body for unmatched routes; verify requesting an undefined route returns 404 with the expected JSON shape
- [x] 5.2 Implement `src/middlewares/error-handler.ts` as Express error middleware returning HTTP 500 with a JSON error body and no stack trace leakage, and register both middlewares last in `app.ts`; verify a route that throws returns 500 with the expected JSON shape and no stack trace in the response

## 6. Linting & Verification

- [x] 6.1 Add ESLint config with the TypeScript plugin; verify `npm run lint` runs clean against the new `src/` files
- [x] 6.2 Run a full build (`npm run build`) and start the compiled server (`npm start`); verify `GET /health` and an unknown route both behave as specified against the compiled output
