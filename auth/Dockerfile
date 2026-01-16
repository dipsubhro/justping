# Single stage - run TypeScript directly with tsx
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev for tsx)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Expose port
EXPOSE 8787

# Run with tsx directly (not using npm script to avoid --env-file issue)
CMD ["npx", "tsx", "src/index.ts"]
