# Demo Script

## 1. Intro

"This is a full-stack video review platform built with React, Vite, Node.js, Express, and MongoDB. It supports authentication, role-based access control, tenant isolation, realtime updates, metadata filtering, custom categories, and streaming-ready video processing."

## 2. Authentication and Access Control

- log in as `admin@acme.test`
- mention `viewer`, `editor`, and `admin`
- mention tenant isolation with `organizationId`

## 3. Admin Features

- show tenant user management
- create a category such as `compliance-review`
- explain that category management is tenant-scoped

## 4. Upload and Processing

- upload a sample video
- mention metadata capture and FFmpeg-backed processing
- point out realtime progress updates in the dashboard

## 5. Filtering and Review

- filter by category, status, sensitivity, date, size, or duration
- open the video detail panel
- show file size, duration, notes, and status

## 6. Streaming

- play the processed video
- mention HTTP range request support and cache-friendly delivery headers

## 7. Close with Honest Future Work

"The current version demonstrates the full user journey end to end. The next production upgrades would be cloud storage, CDN delivery, background processing workers, and more advanced content sensitivity analysis."
