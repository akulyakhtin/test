# Resource Service

A NestJS service for uploading, storing, listing, retrieving, and deleting MP3 files.
MP3 metadata is extracted via Apache Tika and forwarded to song-service.
Communicates with song-service through Eureka service discovery.

---

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

---

## Environment Variables

| Variable              | Default                 | Description                            |
|-----------------------|-------------------------|----------------------------------------|
| `PORT`                | `3000`                  | Port the service listens on            |
| `DB_HOST`             | `localhost`             | PostgreSQL host                        |
| `DB_PORT`             | `5432`                  | PostgreSQL port                        |
| `DB_USERNAME`         | `postgres`              | PostgreSQL username                    |
| `DB_PASSWORD`         | `postgres`              | PostgreSQL password                    |
| `DB_NAME`             | `resource_db`           | PostgreSQL database name               |
| `TIKA_URL`            | `http://localhost:9998` | Apache Tika base URL                   |
| `SONG_SERVER_URL`     | `http://localhost:3001` | Fallback song-service URL (no Eureka)  |
| `EUREKA_HOST`         | `localhost`             | Eureka server host                     |
| `EUREKA_PORT`         | `8761`                  | Eureka server port                     |
| `EUREKA_INSTANCE_HOST`| `localhost`             | Hostname this instance registers with  |

---

## Build the Image Manually (if you want to)

```bash
docker build -t resource-service .
```

---

## Run Locally (if you want to)

Start the database, Tika, and Eureka containers first (from the project root):

```bash
docker compose up -d resource-db tika-server eureka-server
```

Then install dependencies and start the service:

```bash
npm install
npm run start:dev
```

The server will start on http://localhost:3000.

---

## Eureka Dashboard

Once the stack is running, open the Eureka dashboard in a browser:

```
http://localhost:8761
```

Under **Instances currently registered with Eureka** you should see both `RESOURCE-SERVICE` and `SONG-SERVICE` listed as `UP`.

---

## Usage

### Upload an MP3 file

```bash
curl -X POST http://localhost:3000/resources -F "file=@test.mp3"
```

### List uploaded MP3 files

```bash
curl http://localhost:3000/resources
```

### Download an MP3 file

```bash
curl http://localhost:3000/resources/<id> -o downloaded.mp3
```

### Delete an MP3 file

```bash
curl -X DELETE "http://localhost:3000/resources?id=<id>"
```

Deleting a resource also removes the associated song metadata via Eureka-discovered song-service.
