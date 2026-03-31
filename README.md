# Video Upload, Sensitivity Processing, and Streaming Application

Submission-focused full-stack MVP for the assignment brief. The app covers:

- JWT authentication with role-aware access (`viewer`, `editor`, `admin`)
- login and registration flows
- Multi-tenant data isolation via `organizationId`
- Video upload with Multer
- duration capture and richer metadata storage
- FFmpeg-backed processing pipeline with Socket.io progress updates
- Video listing, metadata display, and advanced filtering
- HTTP range request streaming endpoint
- Admin tenant-user management
- Tenant-managed categories
- Delete-video support for cleanup of unavailable or outdated records
- Retry-processing support for failed or unavailable videos
- Deployment artifacts for Docker and Render
- Vercel SPA rewrite config for direct-route support
- React + Vite dashboard for upload, monitoring, and playback

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose, Socket.io, Multer, JWT
- Media: FFmpeg / FFprobe
- Frontend: React, Vite, Axios, Socket.io client
- Storage: local disk uploads

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

## Local Setup

### Backend

1. Copy `backend/.env.example` to `backend/.env`
2. Install dependencies with `npm install`
3. Start MongoDB locally or update the Atlas connection string
4. Install FFmpeg locally if it is not already available
5. Seed demo users with `npm run seed`
6. Run the API with `npm run dev`

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
- Streaming service: HTTP range requests in `/api/videos/:videoId/stream`
- Access control: role-based permissions and tenant filtering
- Metadata filtering: date, size, duration, category, status, sensitivity, text search
- Admin management: create and list users inside the current tenant
- Custom categories: tenant-managed category library
- Maintenance workflow: delete stale or unavailable video records from the dashboard
- Recovery workflow: retry processing for videos that fail or become unavailable
- Deployment readiness: Dockerfiles, Compose setup, Render config, and dedicated docs

## Assumptions and Tradeoffs

- Sensitivity classification is still rule-based and not computer-vision driven.
- Local disk storage is used instead of S3 for speed of implementation.
- CDN rollout and cloud object storage remain future improvements.
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
- Architecture, API, user-guide, design-decision, deployment, and demo-script docs

### Partial

- Sensitivity analysis is rule-based, not frame-level scanning or ML-based moderation
- Multi-tenant support is enforced in app logic, but not backed by full org administration screens

### Pending / Future Work

- CDN rollout in front of processed assets
- Cloud object storage integration
- Background job queue for media workers
- Public deployment execution on a live hosting account
- Recorded product demo

## Suggested Interview Talking Points

- Why FFmpeg is used for streaming preparation while sensitivity classification remains rule-based
- How tenant isolation is enforced at the query layer
- Why HTTP range requests are required for browser-friendly streaming
- How Socket.io improves UX during long-running processing jobs
- What would be upgraded first for production: cloud storage, background jobs, scanning service, caching

## Supporting Docs

- [Architecture](./docs/ARCHITECTURE.md)
- [API](./docs/API.md)
- [User Guide](./docs/USER_GUIDE.md)
- [Design Decisions](./docs/DESIGN_DECISIONS.md)
- [Deployment](./docs/DEPLOYMENT.md)
- [Demo Script](./docs/DEMO_SCRIPT.md)
