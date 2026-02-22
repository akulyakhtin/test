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

## Run with Docker Compose

From the project root, build and start everything:

```bash
docker compose up -d --build
```

The service will be available at http://localhost:3001.

To rebuild only this service after code changes:

```bash
docker compose up -d --build song-service
```

All environment variables and their defaults (used when running locally without Docker):

| Variable      | Default     | Description                  |
|---------------|-------------|------------------------------|
| `PORT`        | `3001`      | Port the service listens on  |
| `DB_HOST`     | `localhost` | PostgreSQL host              |
| `DB_PORT`     | `5433`      | PostgreSQL port (host-exposed port of `song-db`) |
| `DB_USERNAME` | `postgres`  | PostgreSQL username          |
| `DB_PASSWORD` | `postgres`  | PostgreSQL password          |
| `DB_NAME`     | `song_db`   | PostgreSQL database name     |

---

## Build the Image Manually (if you want to)

```bash
docker build -t song-service .
```

---

## Run Locally (if you want to)

Start the database container first (from the project root):

```bash
docker compose up -d song-db
```

Then install dependencies and start the service:

```bash
npm install
npm run start
```

The service will start on http://localhost:3001 and connect to `localhost:5433/song_db`.

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

