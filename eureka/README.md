# Eureka Server

Spring Cloud Netflix Eureka service registry.
Both resource-service and song-service register here on startup.
resource-service uses it to discover song-service instances at runtime.

---

## Run with Docker Compose

From the project root, build and start everything:

```bash
docker compose up -d --build
```

The Eureka dashboard will be available at http://localhost:8761.

To rebuild only this service after code changes:

```bash
docker compose up -d --build eureka-server
```

---

## Environment Variables

| Variable          | Default     | Description                  |
|-------------------|-------------|------------------------------|
| `PORT`            | `8761`      | Port the server listens on   |
| `EUREKA_HOSTNAME` | `localhost` | Hostname for self-registration |

---

## Build the Image Manually (if you want to)

```bash
docker build -t eureka-server .
```

---

## Verify registered services

Open the dashboard in a browser:

```
http://localhost:8761
```

Or via REST:

```bash
# All registered services
curl http://localhost:8761/eureka/apps

# song-service instances only
curl http://localhost:8761/eureka/apps/SONG-SERVICE

# resource-service instances only
curl http://localhost:8761/eureka/apps/RESOURCE-SERVICE
```
