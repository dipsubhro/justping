FROM golang:1.23-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build all binaries
RUN go build -o /bin/api ./cmd/api
RUN go build -o /bin/worker ./cmd/worker
RUN go build -o /bin/scheduler ./cmd/scheduler

FROM alpine:latest

WORKDIR /app

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates

COPY --from=builder /bin/api /app/api
COPY --from=builder /bin/worker /app/worker
COPY --from=builder /bin/scheduler /app/scheduler

# Copy migrations if needed
# COPY --from=builder /app/internal/store/migrations /app/migrations

EXPOSE 8080

CMD ["/app/api"]
