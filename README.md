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

## Start Infrastructure

### Start PostgreSQL

```bash
docker run -d   --name pg   -e POSTGRES_PASSWORD=postgres   -p 5432:5432   postgres:16
```

---

### Start Apache Tika

```bash
docker run -d   --name tika-server   -p 9998:9998   apache/tika:latest
```

---

## Build and Start Services

### Resource Service

```bash
cd resource-service
npm install
npm run start
```

Runs on:

http://localhost:3000

---

### Song Service

```bash
cd song-service
npm install
npm run start
```

Runs on:

http://localhost:3001

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
curl -X DELETE http://localhost:3000/resources/<id>
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


