# API Documentation

## Base URL

- Local backend: `http://localhost:4000/api`

## Authentication

### `POST /auth/register`
Create a new user account.

Request body:

```json
{
  "name": "New User",
  "email": "user@example.com",
  "password": "password123",
  "organizationId": "acme",
  "role": "viewer"
}
```

### `POST /auth/login`
Authenticate and receive a JWT token.

### `GET /auth/me`
Returns the current authenticated user.

## Videos

### `GET /videos`
List tenant-scoped videos with optional filters:

- `search`
- `status`
- `sensitivity`
- `category`
- `dateFrom`
- `dateTo`
- `minSize`
- `maxSize`
- `minDuration`
- `maxDuration`

### `GET /videos/categories/options`
Returns category values collected from managed categories and existing videos.

### `POST /videos`
Upload a video with multipart form data.

Fields:

- `title`
- `description`
- `category`
- `durationSeconds`
- `video`

### `GET /videos/:videoId`
Fetch a single video by ID.

### `GET /videos/:videoId/stream`
Stream a video using HTTP range requests.

## Categories

### `GET /categories`
List tenant-managed categories.

### `POST /categories`
Create a new category for the current tenant.

Allowed roles:

- `editor`
- `admin`

## Users

### `GET /users`
List users inside the current tenant.

Allowed roles:

- `admin`

### `POST /users`
Create a new tenant-scoped user.

Allowed roles:

- `admin`
