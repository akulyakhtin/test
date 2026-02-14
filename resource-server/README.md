## Build

```
npm i
```

## Run
Start Postgres:
```
docker run -d --name pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16
```

Start app
```
npm run start:dev
```

Upload mp3
curl -X POST http://localhost:3000/resources -F "file=@test.mp3"



