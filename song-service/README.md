# Song Service

This service is responsible for storing and serving song metadata.
It is designed to work together with the resource service, which uploads MP3 files
and extracts normalized metadata.

---

## Prerequisites

- Docker
- Node.js 18 or newer
- npm

---

## Run with Docker

### Build the image

```bash
docker build -t song-service .
```

### Run the container

Shared infrastructure (`pg`, `traks-net` network) must already be running.
To start everything together, follow the [main README](../README.md).

Once the shared infrastructure is up, run just this service:

```bash
docker run -d \
  --name song-service \
  --network traks-net \
  -p 3001:3001 \
  -e DB_HOST=pg \
  song-service
```

The service will be available at http://localhost:3001.

All environment variables and their defaults:

| Variable      | Default     | Description                  |
|---------------|-------------|------------------------------|
| `PORT`        | `3001`      | Port the service listens on  |
| `DB_HOST`     | `localhost` | PostgreSQL host              |
| `DB_PORT`     | `5432`      | PostgreSQL port              |
| `DB_USERNAME` | `postgres`  | PostgreSQL username          |
| `DB_PASSWORD` | `postgres`  | PostgreSQL password          |
| `DB_NAME`     | `postgres`  | PostgreSQL database name     |

---

## Build and Run Locally

Install dependencies and start the application:

```bash
npm install
npm run start
```

By default, the service will start on:

```
http://localhost:3001
```

---

## Usage

### Upload a song via the resource service

First, upload an MP3 file using the resource service.
This will automatically create a corresponding song metadata record
in this service.

---

### Retrieve song metadata

Fetch metadata for a song by its identifier:

```bash
curl http://localhost:3001/songs?id=<id>
```

Example response:

```json
{
  "id": "<id>",
  "name": "Test of MP3 File",
  "artist": "Me",
  "album": "Me",
  "duration": "00:12",
  "year": "2006",
  "createdAt": "2026-02-14T15:52:12.911Z"
}
```

