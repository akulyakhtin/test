## Start postgress
docker run -d   --name pg   -e POSTGRES_PASSWORD=postgres   -p 5432:5432   postgres:16

## Build and run
npm install
npm run start

## Upload a song using resource-service and check its metadata in there
curl http://localhost:3001/songs?id=a84da2c1-e9c5-4df8-89b2-73fe27e43bb0