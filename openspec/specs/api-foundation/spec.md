# api-foundation Specification

## Purpose

Provides the foundational Express + TypeScript API application: a layered project structure, configuration loading, centralized error handling, and a health-check endpoint that all future API capabilities build on.

## Requirements

### Requirement: Application Bootstrap
The system SHALL expose an HTTP server built with Express and TypeScript, with the Express application instance defined separately from the process entrypoint that starts listening for connections.

#### Scenario: Server starts and listens
- **WHEN** the process entrypoint is run
- **THEN** the HTTP server starts and listens on the configured port

### Requirement: Layered Folder Architecture
The system SHALL organize application code into distinct layers — routing, controllers, services, middlewares, and configuration — so that request handling, business logic, and cross-cutting concerns are not mixed in a single file.

#### Scenario: Route delegates to controller and service
- **WHEN** an HTTP request matches a defined route
- **THEN** the route delegates handling to a controller, and any business logic is performed in a service invoked by that controller, rather than inline in the route definition

### Requirement: Environment-Based Configuration
The system SHALL load runtime configuration (including the HTTP port) from environment variables through a single configuration module, applying documented default values when a variable is not set.

#### Scenario: Port configured via environment variable
- **WHEN** the `PORT` environment variable is set
- **THEN** the server listens on that port

#### Scenario: Port falls back to default
- **WHEN** the `PORT` environment variable is not set
- **THEN** the server listens on a documented default port

### Requirement: Health Check Endpoint
The system SHALL expose a `GET /health` endpoint that reports the API is running.

#### Scenario: Health check succeeds
- **WHEN** a client sends `GET /health`
- **THEN** the system responds with HTTP 200 and a JSON body indicating the service status

### Requirement: Centralized Error Handling
The system SHALL handle unmatched routes and unhandled errors through centralized middleware, returning a consistent JSON error response instead of leaking a framework default error page or an unhandled exception.

#### Scenario: Unknown route returns 404
- **WHEN** a client requests a route that does not exist
- **THEN** the system responds with HTTP 404 and a JSON error body

#### Scenario: Unhandled error returns 500
- **WHEN** a request handler throws or passes an error to the Express error pipeline
- **THEN** the system responds with HTTP 500 and a JSON error body, without exposing internal stack traces in the response
