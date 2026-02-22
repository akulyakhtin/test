# Resource Server

A simple NestJS service for uploading, storing, listing, retrieving, and
deleting MP3 files. MP3 metadata is extracted using Apache Tika and
stored separately for downstream processing.

------------------------------------------------------------------------

## Requirements

-   Node.js 18+
-   Docker
-   npm

## Run with Docker

### Build the image

```bash
docker build -t resource-service .
```

### Run the container

Shared infrastructure (`pg`, `tika-server`, `traks-net` network) must already be running.
To start everything together, follow the [main README](../README.md).

Once the shared infrastructure is up, run just this service:

```bash
docker run -d \
  --name resource-service \
  --network traks-net \
  -p 3000:3000 \
  -e DB_HOST=pg \
  -e TIKA_URL=http://tika-server:9998 \
  -e SONG_SERVER_URL=http://song-service:3001 \
  resource-service
```

The service will be available at http://localhost:3000.

All environment variables and their defaults:

| Variable         | Default                 | Description                  |
|------------------|-------------------------|------------------------------|
| `PORT`           | `3000`                  | Port the service listens on  |
| `DB_HOST`        | `localhost`             | PostgreSQL host              |
| `DB_PORT`        | `5432`                  | PostgreSQL port              |
| `DB_USERNAME`    | `postgres`              | PostgreSQL username          |
| `DB_PASSWORD`    | `postgres`              | PostgreSQL password          |
| `DB_NAME`        | `postgres`              | PostgreSQL database name     |
| `TIKA_URL`       | `http://localhost:9998` | Apache Tika base URL         |
| `SONG_SERVER_URL`| `http://localhost:3001` | Song service base URL        |

------------------------------------------------------------------------

## Build and run locally

Install dependencies:

``` bash
npm install
```

``` bash
npm run start:dev
```

The server will start on:

http://localhost:3000

------------------------------------------------------------------------

## Usage

### Upload an MP3 file

``` bash
curl -X POST http://localhost:3000/resources   -F "file=@test.mp3"
```

------------------------------------------------------------------------

### List uploaded MP3 files

``` bash
curl http://localhost:3000/resources
```

Returns id, size, filename, etc. for all stored files

------------------------------------------------------------------------

### Download or play an MP3 file

``` bash
curl http://localhost:3000/resources/<ID> -o downloaded.mp3
```


------------------------------------------------------------------------

### Delete an MP3 file

``` bash
curl -X DELETE http://localhost:3000/resources/<ID>
```


