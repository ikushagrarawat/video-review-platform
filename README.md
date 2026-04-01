# Video Upload, Sensitivity Processing, and Streaming Application

Submission-focused full-stack MVP for the assignment brief. The app covers:

- JWT authentication with role-aware access (`viewer`, `editor`, `admin`)
- login and registration flows
- Multi-tenant data isolation via `organizationId`
- Video upload with Multer
- duration capture and richer metadata storage
- FFmpeg-backed processing pipeline with Socket.io progress updates
- Video listing, metadata display, and advanced filtering
- HTTP range request streaming endpoint with CloudFront redirect support
- Admin tenant-user management
- Tenant-managed categories
- Delete-video support for cleanup of unavailable or outdated records
- Retry-processing support for failed or unavailable videos
- S3-backed media storage and CloudFront delivery support
- Deployment artifacts for Docker and Render
- Vercel SPA rewrite config for direct-route support
- React + Vite dashboard for upload, monitoring, and playback

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose, Socket.io, Multer, JWT
- Media: FFmpeg / FFprobe
- Frontend: React, Vite, Axios, Socket.io client
- Storage: local disk fallback plus AWS S3 object storage
- CDN: AWS CloudFront

## Project Structure

```text
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
frontend/
  src/
    api/
    components/
    context/
    hooks/
    pages/
    styles/
docs/
```

## Current Status

The project is now in a strong MVP-plus state:

- local development flow is complete
- deployment flow is in place
- Render backend deployment is working
- frontend deployment has been validated, with SPA rewrite support for direct routes
- AWS S3 and CloudFront integration has been wired and verified for newly uploaded videos
- delete and retry workflows are implemented for broken or stale media records

In practical terms, the core assignment journey works:

- authenticate
- upload a video
- watch realtime processing progress
- classify the video as `safe` or `flagged`
- filter/search videos
- stream a processed video
- manage tenant users and categories
- store media in S3 and deliver processed assets via CloudFront

## Local Setup

### Backend

1. Copy `backend/.env.example` to `backend/.env`
2. Install dependencies with `npm install`
3. Start MongoDB locally or update the Atlas connection string
4. Install FFmpeg locally if it is not already available
5. Optionally configure AWS S3 / CloudFront variables for cloud-backed media delivery
6. Seed demo users with `npm run seed`
7. Run the API with `npm run dev`

### Frontend

1. Copy `frontend/.env.example` to `frontend/.env`
2. Install dependencies with `npm install`
3. Run the UI with `npm run dev`

## Demo Users

- `admin@acme.test` / `password123`
- `editor@acme.test` / `password123`
- `viewer@acme.test` / `password123`
- `editor@beta.test` / `password123`

Three demo accounts use tenant `acme`; `editor@beta.test` is in tenant `beta` to help demonstrate isolation.

## Assignment Mapping

- Full-stack architecture: Express + MongoDB + React + Vite
- Video management: upload, metadata, list, secure access
- Sensitivity processing: FFmpeg-backed streaming preparation plus rule-based safe/flagged classification
- Realtime updates: Socket.io progress events
- Streaming service: HTTP range requests in `/api/videos/:videoId/stream`, with redirect support to CloudFront-backed processed assets
- Access control: role-based permissions and tenant filtering
- Metadata filtering: date, size, duration, category, status, sensitivity, text search
- Admin management: create and list users inside the current tenant
- Custom categories: tenant-managed category library
- Maintenance workflow: delete stale or unavailable video records from the dashboard
- Recovery workflow: retry processing for videos that fail or become unavailable
- Cloud delivery readiness: AWS S3 upload support and CloudFront-backed delivery URLs
- Deployment readiness: Dockerfiles, Compose setup, Render config, Vercel SPA routing config, and dedicated docs

## Assumptions and Tradeoffs

- Sensitivity classification is still rule-based and not computer-vision driven.
- Media processing still runs inside the API service rather than a separate worker queue.
- The app supports local-disk fallback for development, but cloud-backed storage is now available through S3 + CloudFront.
- CDN delivery is implemented for newly uploaded processed assets when AWS environment variables are configured.
- Tenant isolation is modeled through `organizationId`; a fuller production version would add organization management screens and stricter audit logging.

## Completion Snapshot

### Done

- Full-stack architecture and runnable app
- JWT auth and registration
- Tenant-aware RBAC (`viewer`, `editor`, `admin`)
- Upload, list, stream, and progress-tracking flow
- Metadata filtering and category support
- Admin tenant user-management panel
- FFmpeg-backed metadata extraction and streaming preparation
- S3-backed media upload flow
- CloudFront-backed processed video delivery
- Delete and retry maintenance workflows
- Multi-origin CORS support for deployed frontends
- Render backend deployment support and Vercel SPA route handling
- Architecture, API, user-guide, design-decision, deployment, and demo-script docs

### Partial

- Sensitivity analysis is rule-based, not frame-level scanning or ML-based moderation
- Multi-tenant support is enforced in app logic, but not backed by full org administration screens
- Public deployment works, but final production hardening still depends on stable frontend hosting configuration and environment setup

### Pending / Future Work

- Background job queue for media workers
- Richer organization management and system settings screens
- CloudFront cache invalidation strategy for deleted assets
- Production-grade object lifecycle policies and signed/private media delivery
- Recorded product demo
- ML/computer-vision-based sensitivity analysis

## Suggested Interview Talking Points

- Why FFmpeg is used for streaming preparation while sensitivity classification remains rule-based
- How tenant isolation is enforced at the query layer
- Why HTTP range requests are required for browser-friendly streaming, and how CloudFront delivery changes the happy path in production
- How Socket.io improves UX during long-running processing jobs
- Why S3 + CloudFront was introduced as the first production-oriented media upgrade
- What would be upgraded next for production: background jobs, scanning service, caching, stricter private-media controls

## Deployment Notes

The project now supports this recommended deployment shape:

- backend on Render
- frontend on Vercel or Render Static Site
- database on MongoDB Atlas
- object storage on AWS S3
- CDN delivery on AWS CloudFront

Important deployment behavior:

- old locally uploaded videos will not be portable to cloud hosting just because their metadata exists in MongoDB
- newly uploaded videos on the deployed app are the correct way to verify S3 and CloudFront delivery
- deleting an object from S3 alone does not remove its MongoDB record; use the in-app delete workflow for full cleanup

## Key Environment Variables

### Backend

- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `CLIENT_URLS`
- `UPLOAD_DIR`
- `PROCESSED_DIR`
- `FFMPEG_PATH`
- `FFPROBE_PATH`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `S3_BUCKET_NAME`
- `CDN_BASE_URL`

### Frontend

- `VITE_API_URL`
- `VITE_SOCKET_URL`

## Supporting Docs

- [Architecture](./docs/ARCHITECTURE.md)
- [API](./docs/API.md)
- [User Guide](./docs/USER_GUIDE.md)
- [Design Decisions](./docs/DESIGN_DECISIONS.md)
- [Deployment](./docs/DEPLOYMENT.md)
- [Demo Script](./docs/DEMO_SCRIPT.md)
