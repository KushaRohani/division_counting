# Docker deployment

Deploy the division counting app (client + server + PostgreSQL) on a private server using Docker.

## Quick start

1. **Copy environment file** (at repo root):
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set at least `POSTGRES_PASSWORD`. If you will access the app from other devices, set `VITE_API_URL=http://YOUR_SERVER_IP:3001`.

2. **Build and run**:
   ```bash
   docker compose up -d --build
   ```

3. **Open the app**:
   - **Client (UI):** http://localhost/division_counting/ (or http://YOUR_SERVER_IP/division_counting/)
   - **Server (API):** http://localhost:3001 (or http://YOUR_SERVER_IP:3001)

## Services

| Service   | Port | Description                    |
|----------|------|--------------------------------|
| client   | 80   | React app (nginx)              |
| server   | 3001 | Node/Express API + Prisma      |
| postgres | —    | PostgreSQL 16 (internal only)  |

- Database migrations run automatically when the server container starts.
- Data is stored in a Docker volume `postgres_data`.

## Access from other devices

If you use the app from another machine (e.g. phone or another PC on the same network):

1. Set in `.env`: `VITE_API_URL=http://YOUR_SERVER_IP:3001` (replace with your server’s IP or hostname).
2. Rebuild the client so the API URL is baked in:
   ```bash
   docker compose build client
   docker compose up -d client
   ```
3. Open http://YOUR_SERVER_IP/division_counting/ in the browser.

## Useful commands

```bash
# View logs
docker compose logs -f

# Stop everything
docker compose down

# Stop and remove database volume (deletes all data)
docker compose down -v
```

## Build only (no compose)

- **Client:** `docker build -t division-client --build-arg VITE_API_URL=http://localhost:3001 ./client`
- **Server:** Requires `DATABASE_URL` at runtime. Use `docker compose` or run Postgres separately and pass `DATABASE_URL` when starting the server container.
