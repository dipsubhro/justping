# Project Structure

This document explains the purpose of each folder in the `backend` directory.

## `cmd/`
Contains the main entry points for the application.
- **`api/`**: The HTTP API server entry point.
- **`worker/`**: The background worker entry point (for crawling tasks).
- **`scheduler/`**: The job scheduler entry point.

## `internal/`
Contains private application code that cannot be imported by other projects.
- **`app/`**: Application bootstrapping and wiring logic.
- **`config/`**: Configuration loading (environment variables, flags).
- **`domain/`**: Core business models and interfaces. Strictly no external dependencies.
- **`repository/`**: Database access implementations and interfaces.
- **`service/`**: Business logic layer. Orchestrates data flow between repositories and other components.
- **`crawler/`**: Logic for fetching and extracting data from websites.
- **`detector/`**: Logic for detecting changes between different versions of a page.
- **`queue/`**: Job queue abstractions and implementations (Redis, DB, etc.).
- **`http/`**: HTTP layer components.
    - **`handlers/`**: HTTP request handlers (controllers).
    - **`middleware/`**: HTTP middlewares (Auth, CORS, Rate limiting).
    - **`router.go`**: Router setup.
- **`notifier/`**: Implementations for sending alerts (Email, Telegram, Webhook).
- **`store/`**: Database connection setup and migration scripts.
- **`util/`**: Shared utility functions (Logger, Hashing, Retry logic).

## `pkg/`
Contains library code that is safe to be imported by other projects.
- **`selector/`**: Logic related to CSS/XPath selector generation.

## `scripts/`
DevOps and development scripts.
- **`migrate.sh`**: Script to run database migrations.
- **`seed.sh`**: Script to seed the database with initial data.

## Root Files
- **`Dockerfile`**: Docker build instructions.
- **`docker-compose.yml`**: Local development environment setup.
- **`go.mod` / `go.sum`**: Go module definitions.
