# Resource Server

A simple NestJS service for uploading, storing, listing, retrieving, and
deleting MP3 files. MP3 metadata is extracted using Apache Tika and
stored separately for downstream processing.

------------------------------------------------------------------------

## Requirements

-   Node.js 18+
-   Docker
-   npm

## Run with Docker Compose

From the project root, build and start everything:

```bash
docker compose up -d --build
```

The service will be available at http://localhost:3000.

To rebuild only this service after code changes:

```bash
docker compose up -d --build resource-service
```

All environment variables and their defaults (used when running locally without Docker):

| Variable         | Default                 | Description                  |
|------------------|-------------------------|------------------------------|
| `PORT`           | `3000`                  | Port the service listens on  |
| `DB_HOST`        | `localhost`             | PostgreSQL host              |
| `DB_PORT`        | `5432`                  | PostgreSQL port              |
| `DB_USERNAME`    | `postgres`              | PostgreSQL username          |
| `DB_PASSWORD`    | `postgres`              | PostgreSQL password          |
| `DB_NAME`        | `resource_db`           | PostgreSQL database name     |
| `TIKA_URL`       | `http://localhost:9998` | Apache Tika base URL         |
| `SONG_SERVER_URL`| `http://localhost:3001` | Song service base URL        |

------------------------------------------------------------------------

## Build the Image Manually (if you want to)

```bash
docker build -t resource-service .
```

------------------------------------------------------------------------

## Run Locally (if you want to)

Start the database and Tika containers first (from the project root):

```bash
docker compose up -d resource-db tika-server
```

Then install dependencies and start the service:

```bash
npm install
npm run start:dev
```

The server will start on http://localhost:3000 and connect to `localhost:5432/resource_db`.

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
curl -X DELETE "http://localhost:3000/resources?id=<ID>"
```


