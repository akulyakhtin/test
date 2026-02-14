# Resource Server

A simple NestJS service for uploading, storing, listing, retrieving, and
deleting MP3 files. MP3 metadata is extracted using Apache Tika and
stored separately for downstream processing.

------------------------------------------------------------------------

## Requirements

-   Node.js 18+
-   Docker
-   npm

------------------------------------------------------------------------

## Build

Install dependencies:

``` bash
npm install
```

------------------------------------------------------------------------

## Run

### Start PostgreSQL

``` bash
docker run -d   --name pg   -e POSTGRES_PASSWORD=postgres   -p 5432:5432   postgres:16
```

------------------------------------------------------------------------

### Start Apache Tika

``` bash
docker run -d   --name tika-server   -p 9998:9998   apache/tika:latest
```

Apache Tika will be available at:

http://localhost:9998

------------------------------------------------------------------------

### Start the application

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


