# Architecture Overview

## High-Level Design

The application is split into two primary services:

- `frontend/`: React + Vite client for authentication, uploads, filtering, admin management, and playback
- `backend/`: Express + MongoDB API for auth, RBAC, tenant-aware video management, category management, realtime updates, and streaming

## Core Workflow

1. User authenticates with JWT-based login or registration.
2. User uploads a video with metadata and optional category.
3. Backend stores the file locally and persists metadata in MongoDB.
4. A mock processing pipeline updates progress over time.
5. Socket.io emits realtime progress events to the frontend.
6. Processed videos can be filtered, reviewed, and streamed using HTTP range requests.

## Data Isolation

- Every user belongs to an `organizationId`.
- Videos, users, and managed categories are scoped by `organizationId`.
- `viewer` users can access only their own videos.
- `editor` and `admin` users can manage broader tenant content.

## Main Domain Models

- `User`: identity, role, tenant
- `Video`: metadata, processing state, file details, analysis output
- `Category`: tenant-managed category library

## Realtime Design

- Socket.io is used to register the current user socket
- The processing service emits updates keyed by `ownerId`
- Frontend listens for `video-progress` events and updates the dashboard live

## Current Tradeoffs

- Video analysis is mocked rather than FFmpeg/computer-vision based
- Local disk storage is used instead of S3/GCS
- No background job queue is used yet
- No CDN or caching layer is configured yet
