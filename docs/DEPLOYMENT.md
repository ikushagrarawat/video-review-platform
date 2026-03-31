# Deployment Guide

## Local Docker Deployment

Run the full stack with Docker Compose:

```bash
docker compose up --build
```

Services:

- frontend: `http://localhost:5173`
- backend: `http://localhost:4000`

## Render Deployment

A starter [render.yaml](/Users/kushagrarawat/Documents/New%20project/render.yaml) is included for Render-based deployment.

### Backend environment variables

- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `UPLOAD_DIR`
- `PROCESSED_DIR`
- `CDN_BASE_URL` (optional)

### Frontend environment variables

- `VITE_API_URL`
- `VITE_SOCKET_URL`

## Recommended Production Upgrades

- move uploads and processed assets to S3 or GCS
- run FFmpeg workers separately from the API server
- add a background job queue
- put a CDN in front of processed assets
