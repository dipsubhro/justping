# Project Structure

This document outlines the architecture and purpose of every file and folder in the `backend` directory.

## Root Directory

| File / Folder | Description |
|---|---|
| `.gitignore` | Specifies intentionally untracked files that git should ignore (e.g., binaries, logs, local env files). |
| `Dockerfile` | Defines the instructions to build the Go application Docker image. |
| `docker-compose.yml` | Defines services for local development, including the backend app and dependencies like Postgres/Redis. |
| `go.mod` | The Go module configuration file, defining the module path and dependencies. |
| `go.sum` | Contains the expected cryptographic checksums of the content of specific module versions. |
| `cmd/` | Contains the main entry points for the application. |
| `internal/` | Contains private application code that is specific to this project. |
| `pkg/` | Contains library code that could potentially be used by other projects. |
| `scripts/` | Contains utility scripts for development and operations. |

## `.gitignore` Content
The `.gitignore` file is configured to ignore:
- **Binaries**: `/bin/`, `/dist/`, `main`, `app`
- **OS Specific**: `.DS_Store`, `Thumbs.db`
- **IDE Configs**: `.idea/`, `.vscode/`, `*.swp`
- **Go specifics**: `vendor/`, `go.work`, `go.work.sum`
- **Environment**: `.env`, `.env.local` (Prevents secrets from being committed)
- **Logs**: `*.log`
- **Docker**: `docker-compose.override.yml`

## `cmd/` Folder
This directory holds the entry points (main packages).
- **`cmd/api/main.go`**: Entry point for the REST API server.
- **`cmd/worker/main.go`**: Entry point for the background crawling worker.
- **`cmd/scheduler/main.go`**: Entry point for the job scheduler service.

## `internal/` Folder
This stores the core logic of the application.
- **`app/`**: Bootstrapping logic (`api.go`, `scheduler.go`, `worker.go`) to wire up dependencies.
- **`config/`**: Configuration management (`config.go`) to load settings from env variables or flags.
- **`crawler/`**: Logic for fetching web pages (`fetcher.go`, `renderer.go`) and handling rate limits.
- **`detector/`**: Logic for detecting changes in page content (`diff.go`, `hasher.go`, `normalize.go`).
- **`domain/`**: Domain models and interface definitions (`user.go`, `watch.go`, `job.go`, `alert.go`). This layer is pure and dependency-free.
- **`http/`**: HTTP transport layer.
    - **`handlers/`**: Controllers for handling API requests (`auth_handler.go`, `watch_handler.go`, `alert_handler.go`).
    - **`middleware/`**: Middleware for Auth, CORS, and Rate Limiting.
    - **`router.go`**: Sets up the HTTP routes.
- **`notifier/`**: Implementations for notification channels (`email.go`, `telegram.go`, `webhook.go`, `notifier.go`).
- **`queue/`**: Distributed queue implementations (`redis_queue.go`, `db_queue.go`) to manage jobs.
- **`repository/`**: Data access layer implementations (`user_repo.go`, `watch_repo.go`, `job_repo.go`) interacting with the database.
- **`service/`**: Business logic layer (`watch_service.go`, `crawl_service.go`, `alert_service.go`) coordinating between repositories and other components.
- **`store/`**: Database initiation code (`postgres.go`).
- **`util/`**: Utilities for logging, retry mechanisms, and hashing (`logger.go`, `hash.go`, `retry.go`).

## `pkg/` Folder
External-ready packages.
- **`selector/`**: Helper package to generating CSS selectors (`generator.go`).

## `scripts/` Folder
Helper scripts for the developer workflow.
- **`migrate.sh`**: Runs database migrations.
- **`seed.sh`**: Populates the database with initial dummy data.
