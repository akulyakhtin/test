# Resource and Song Services

This project consists of two microservices coordinated through a Eureka service registry:

- **resource-service** — Stores MP3 files in PostgreSQL and extracts metadata using Apache Tika.
- **song-service** — Stores normalized MP3 metadata. Each song record shares the same `id` as its resource.
- **eureka-server** — Spring Cloud Netflix Eureka service registry. Both services register here on startup; resource-service discovers song-service through it.

---

## Prerequisites

- Docker

---

## Run with Docker Compose

Build images and start all containers:

```bash
docker compose up -d --build
```

| Service          | URL                        |
|------------------|----------------------------|
| resource-service | http://localhost:3000      |
| eureka-server    | http://localhost:8761      |

> song-service has no fixed host port — it is accessed internally by resource-service via Eureka discovery.

To stop everything:

```bash
docker compose down
```

---

### Eureka Dashboard

Open the Eureka dashboard in a browser:

```
http://localhost:8761
```

Under **Instances currently registered with Eureka** you should see both `RESOURCE-SERVICE` and `SONG-SERVICE` listed as `UP`.

Or verify via REST:

```bash
# All registered services
curl http://localhost:8761/eureka/apps

# song-service instances only
curl http://localhost:8761/eureka/apps/SONG-SERVICE
```

---

## Usage

### Upload an MP3

```bash
curl -X POST http://localhost:3000/resources -F "file=@test.mp3"
```

Response:

```json
{
  "id": "<id>",
  "filename": "test.mp3",
  "size": 198658,
  "mimeType": "application/octet-stream"
}
```

---

### List uploaded MP3s

```bash
curl http://localhost:3000/resources
```

---

### Download an MP3

```bash
curl http://localhost:3000/resources/<id> -o downloaded.mp3
```

---

### Retrieve song metadata

Song metadata is written to song-service automatically on upload. Fetch it via resource-service using the same id:

```bash
curl http://localhost:3001/songs/<id>
```

> Only available when song-service has a host port mapping (e.g. running locally). In Docker Compose the song-service is internal.

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

---

### Delete an MP3

```bash
curl -X DELETE "http://localhost:3000/resources?id=<id>"
```

This will:
1. Delete the MP3 bytes from resource-service
2. Call song-service via Eureka to delete the associated metadata

---

## Scale song-service

To run multiple song-service instances (resource-service will discover them via Eureka):

```bash
docker compose up --scale song-service=2 -d
```

Verify both instances are registered:

```bash
curl http://localhost:8761/eureka/apps/SONG-SERVICE
```

---

## Run Locally (if you want to)

Start infrastructure containers first, then run the services on the host:

```bash
docker compose up -d resource-db song-db tika-server eureka-server
```

Then in separate terminals:

```bash
# resource-service
cd resource-service
npm install
npm run start

# song-service
cd song-service
npm install
npm run start
```

Services use their built-in defaults when running locally:

| Service          | Default DB connection         | Eureka             |
|------------------|-------------------------------|--------------------|
| resource-service | `localhost:5432/resource_db`  | `localhost:8761`   |
| song-service     | `localhost:5433/song_db`      | `localhost:8761`   |

---

## Build Images Manually (if you want to)

```bash
docker build -t resource-service ./resource-service
docker build -t song-service ./song-service
docker build -t eureka-server ./eureka
```
