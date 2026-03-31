# Video Upload, Sensitivity Processing, and Streaming Application

Submission-focused full-stack MVP for the assignment brief. The app covers:

- JWT authentication with role-aware access (`viewer`, `editor`, `admin`)
- login and registration flows
- Multi-tenant data isolation via `organizationId`
- Video upload with Multer
- duration capture and richer metadata storage
- Mock sensitivity analysis pipeline with Socket.io progress updates
- Video listing, metadata display, and advanced filtering
- HTTP range request streaming endpoint
- Admin tenant-user management
- React + Vite dashboard for upload, monitoring, and playback

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose, Socket.io, Multer, JWT
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
```

## Local Setup

### Backend

1. Copy `backend/.env.example` to `backend/.env`
2. Install dependencies with `npm install`
3. Start MongoDB locally or update the Atlas connection string
4. Seed demo users with `npm run seed`
5. Run the API with `npm run dev`

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
- Sensitivity processing: mock automated analysis with safe/flagged result
- Realtime updates: Socket.io progress events
- Streaming service: HTTP range requests in `/api/videos/:videoId/stream`
- Access control: role-based permissions and tenant filtering
- Metadata filtering: date, size, duration, category, status, sensitivity, text search
- Admin management: create and list users inside the current tenant

## Assumptions and Tradeoffs

- Sensitivity analysis is mocked with deterministic keyword rules to keep the MVP deliverable inside a 48-hour window.
- Local disk storage is used instead of S3 for speed of implementation.
- Compression, CDN, and true transcoding remain future improvements.
- Tenant isolation is modeled through `organizationId`; a fuller production version would add organization management screens and stricter audit logging.

## Completion Snapshot

### Done

- Full-stack architecture and runnable app
- JWT auth and registration
- Tenant-aware RBAC (`viewer`, `editor`, `admin`)
- Upload, list, stream, and progress-tracking flow
- Metadata filtering and category support
- Admin tenant user-management panel

### Partial

- Sensitivity analysis is mock logic, not frame-level scanning
- Duration capture is client-side metadata based, not FFmpeg extraction
- Multi-tenant support is enforced in app logic, but not backed by full org administration screens

### Pending / Future Work

- Real FFmpeg processing and compression presets
- CDN and caching strategy
- Cloud object storage integration
- Deployment, API docs, and recorded product demo

## Suggested Interview Talking Points

- Why a mock processing queue was chosen over FFmpeg-heavy analysis for the MVP
- How tenant isolation is enforced at the query layer
- Why HTTP range requests are required for browser-friendly streaming
- How Socket.io improves UX during long-running processing jobs
- What would be upgraded first for production: cloud storage, background jobs, scanning service, caching
