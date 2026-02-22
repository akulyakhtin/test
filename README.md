# Resource and Song Services

This project consists of two services:

- **resource-service**  
  Stores MP3 files in PostgreSQL and extracts metadata using Apache Tika.

- **song-service**  
  Stores normalized MP3 metadata.
  Each song record uses the same `id` as the corresponding resource.

---

## Prerequisites

- Docker
- Node.js 18+
- npm

---

## Run with Docker Compose

Build images and start all containers with a single command:

```bash
docker compose up -d --build
```

| Service          | URL                   |
|------------------|-----------------------|
| resource-service | http://localhost:3000 |
| song-service     | http://localhost:3001 |

To stop everything:

```bash
docker compose down
```

---

## Build Images Manually (if you want to)

```bash
docker build -t resource-service ./resource-service
docker build -t song-service ./song-service
```

---

## Run Locally (if you want to)

Start only the database and Tika containers, then run the services on the host:

```bash
docker compose up -d resource-db song-db tika-server
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

Services use their built-in defaults to connect to the database containers:

| Service          | Default DB connection          |
|------------------|-------------------------------|
| resource-service | `localhost:5432/resource_db`  |
| song-service     | `localhost:5433/song_db`      |

---

## Usage

### Upload an MP3 (resource service)

```bash
curl -X POST http://localhost:3000/resources   -F "file=@test.mp3"
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

### Confirm the resource exists

```bash
curl http://localhost:3000/resources
```

```json
[
  {
    "id": "<id>",
    "filename": "test.mp3",
    "size": 198658,
    "mimeType": "application/octet-stream"
  }
]
```

---

### Download the MP3 back

```bash
curl http://localhost:3000/resources/<id> -o downloaded.mp3
```

The downloaded file should play normally.

---

### Retrieve song metadata (song service)

```bash
curl http://localhost:3001/songs/<id>
```

Response:

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

## Deletion Flow

### Delete the MP3 (resource service)

```bash
curl -X DELETE "http://localhost:3000/resources?id=<id>"
```

This will:
1. Delete the MP3 bytes from the resource service
2. Call the song service to delete the associated metadata

---

### Verify metadata is deleted (song service)

```bash
curl http://localhost:3001/songs/<id>
```

Expected response:

```json
{
  "statusCode": 404,
  "message": "Not Found"
}
```


