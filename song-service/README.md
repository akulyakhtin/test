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

## Start PostgreSQL

Run PostgreSQL in Docker:

```bash
docker run -d   --name pg   -e POSTGRES_PASSWORD=postgres   -p 5432:5432   postgres:16
```

---

## Build and Run the Service

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

