# JustPing

JustPing is an open-source website monitoring tool that helps you keep track of your website's uptime and performance.

![Analytics Dashboard](client/src/assets/images/analytics.png)

## Installation & Setup

This project consists of three main components: Client (Frontend), Auth Service, and Backend (API).

### Prerequisites

-   Node.js (v18+)
-   Go (v1.20+)
-   MongoDB
-   pnpm (recommended) or npm

### 1. Environment Configuration

First, set up the environment variables for the backend and auth services.

**Backend:**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your actual values (MongoDB URI, API Key, etc.)
```

**Auth Service:**
```bash
cp auth/.env.example auth/.env
# Edit auth/.env with your secrets (Better Auth Secret, Google Client ID, etc.)
```

### 2. Start the Auth Service

Navigate to the `auth` directory and start the service:

```bash
cd auth
pnpm install
pnpm run dev
```

The auth service typically runs on port `8787`.

### 3. Start the Backend API

Navigate to the `backend` directory and run the Go server:

```bash
cd backend
go mod download
go run cmd/api/main.go
```

The backend API typically runs on port `8080` (or as configured).

### 4. Start the Client (Frontend)

Navigate to the `client` directory and start the Vite development server:

```bash
cd client
pnpm install
pnpm run dev
```

The frontend will be available at `http://localhost:5173`.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
