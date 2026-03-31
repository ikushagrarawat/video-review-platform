# Assumptions and Design Decisions

## Why the processing pipeline is mocked

The assignment scope includes video sensitivity analysis, compression, realtime updates, and streaming. Within a limited delivery window, the implementation prioritizes the full user journey and architectural clarity over heavy media infrastructure. The current pipeline simulates long-running processing and produces deterministic sensitivity output.

## Why local file storage is used

Local storage reduces setup complexity for a working MVP. In production, this should move to a cloud object store such as S3 or GCS.

## Why tenant isolation is query-based

The current design enforces isolation through `organizationId` checks at the API/query layer. This keeps the implementation readable and easy to explain in an interview while still demonstrating the multi-tenant concept.

## Why Socket.io is included

The PDF explicitly calls for realtime progress tracking. Socket.io provides an easy way to show backend processing state changes in the UI without polling.

## Most important future upgrades

- FFmpeg-based metadata extraction and compression
- cloud storage
- background job queue
- CDN and caching
- deployment and monitoring
