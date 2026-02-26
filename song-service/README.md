# Song Service

A NestJS service for storing and serving MP3 song metadata.
Works together with resource-service, which uploads MP3 files and forwards extracted metadata here.
Registers with Eureka on startup so resource-service can discover it.

---

## Run with Docker Compose

From the project root, build and start everything:

```bash
docker compose up -d --build
```

> song-service has no fixed host port in Docker Compose — it is accessed internally by resource-service via Eureka discovery.

To rebuild only this service after code changes:

```bash
docker compose up -d --build song-service
```

### Scale to multiple instances

```bash
docker compose up --scale song-service=2 --build -d
```

Each instance registers in Eureka with a unique identity derived from its container hostname.

---

## Environment Variables

| Variable              | Default     | Description                                       |
|-----------------------|-------------|---------------------------------------------------|
| `PORT`                | `3001`      | Port the service listens on                       |
| `DB_HOST`             | `localhost` | PostgreSQL host                                   |
| `DB_PORT`             | `5433`      | PostgreSQL port (host-exposed port of `song-db`)  |
| `DB_USERNAME`         | `postgres`  | PostgreSQL username                               |
| `DB_PASSWORD`         | `postgres`  | PostgreSQL password                               |
| `DB_NAME`             | `song_db`   | PostgreSQL database name                          |
| `EUREKA_HOST`         | `localhost` | Eureka server host                                |
| `EUREKA_PORT`         | `8761`      | Eureka server port                                |

---

## Build the Image Manually (if you want to)

```bash
docker build -t song-service .
```

---

## Run Locally (if you want to)

Start the database and Eureka containers first (from the project root):

```bash
docker compose up -d song-db eureka-server
```

Then install dependencies and start the service:

```bash
npm install
npm run start
```

The service will start on http://localhost:3001 and register with Eureka at `localhost:8761`.

---

## Usage

Song records are created automatically when an MP3 is uploaded via resource-service.

### Retrieve song metadata

```bash
curl http://localhost:3001/songs/<id>
```

> Only available when running locally (no host port mapping in Docker Compose).

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
