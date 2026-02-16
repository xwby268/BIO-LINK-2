# Baeci Store

## Overview

Baeci Store is a premium BioLink and digital store web application built for an Indonesian market. It serves as a personal/business landing page with social media links, a product/service catalog (top-up gaming, escrow/rekber services, digital services), a community feed, and an admin dashboard. The app features an iOS-inspired glassmorphism design aesthetic with dark themes and translucent widgets.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend
- **Runtime:** Node.js with Express.js (v4.18) — chosen for simplicity and fast setup
- **Entry point:** `server.js` running on port 5000
- **Middleware stack:** CORS enabled globally, body-parser for JSON parsing, static file serving from `public/` directory
- **API pattern:** RESTful JSON endpoints under `/api/` prefix
- **Route handling:** Express serves HTML files without `.html` extension via a catch-all `/:page` route that looks up files in `public/`
- **Authentication:** Simple password-based admin auth. The admin password is stored in `config.js` and checked against the request body/query on each admin API call. There are no sessions, tokens, or JWT — the password is sent with every admin request. This is intentionally minimal.

### API Endpoints
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `GET` | `/api/config` | Fetch site settings | None |
| `POST` | `/api/admin/config` | Update site settings | Password in body |
| `GET` | `/api/posts` | Get all posts (sorted by date desc) | None |
| `POST` | `/api/posts` | Create a new post | None |
| `DELETE` | `/api/admin/posts/:id` | Delete a post | Password as query param |

### Frontend
- **Architecture:** Static HTML pages served from `public/` directory — no frontend framework, no build step, no bundler
- **Styling:** Tailwind CSS loaded via CDN (`cdn.tailwindcss.com`), plus custom CSS for iOS-style glassmorphism effects (backdrop blur, translucent cards, dark backgrounds)
- **Fonts/Icons:** Google Fonts (Inter), Font Awesome 6.4 via CDN
- **Key pages:**
  - `index.html` — Main BioLink landing page with profile, social links, navigation
  - `dbadmin.html` — Admin dashboard for site configuration and content management
  - `faq.html` — FAQ page with accordion-style questions
  - `privacy.html` — Privacy policy page
  - `rules.html` — Community guidelines page
  - `uploader.html` — File upload interface (uploads to VyDrive)
  - `dashboard.html` — Placeholder (currently empty)
  - `sosial.html` — Placeholder (currently empty)
- **JavaScript:** `public/script.js` exists but is currently empty; inline `<script>` tags in HTML files handle interactivity and Tailwind config
- **Language:** UI is primarily in Indonesian (Bahasa Indonesia)

### Database
- **Database:** MongoDB Atlas (cloud-hosted)
- **Driver:** Native MongoDB Node.js driver (v6.3) — NOT Mongoose. Direct collection operations are used.
- **Database name:** `baeci_store`
- **Collections:**
  - `settings` — Site configuration stored as a single document with `type: 'general'`
  - `posts` — Community/social feed posts
- **Connection pattern:** Singleton in `db.js` — connects once on first call and reuses the connection for all subsequent requests

### File Upload
- `uploader.js` provides a utility to upload files to VyDrive (free file hosting)
- Uses `node-fetch`, `file-type`, and `form-data` packages
- The upload endpoint is exposed via the admin dashboard UI

### Deployment
- Originally configured for Vercel (`vercel.json` present) with URL rewrites routing all requests to `server.js`
- On Replit, the app runs as a standard Node.js server on port 5000

## External Dependencies

### Third-Party Services
- **MongoDB Atlas** — Cloud database. Connection string is in `config.js`. The database is `baeci_store` on a cluster called `sosial`.
- **VyDrive** — Free file/image hosting service used for uploading media via `uploader.js`. Files are uploaded via their public API at `https://vydrive.zone.id/upload`.

### NPM Packages
| Package | Purpose |
|---------|---------|
| `express` (4.18) | Web server framework |
| `mongodb` (6.3) | Native MongoDB driver |
| `body-parser` | JSON request body parsing |
| `cors` | Cross-origin resource sharing |
| `multer` (2.0) | Multipart form data / file upload handling |
| `node-fetch` (2.7) | HTTP client for server-side requests (Catbox uploads) |
| `file-type` (16.5) | Detect file MIME type from buffer |
| `form-data` (4.0) | Build multipart form data for uploads |

### CDN Resources
- Tailwind CSS — `cdn.tailwindcss.com`
- Font Awesome 6.4 — `cdnjs.cloudflare.com`
- Google Fonts (Inter) — `fonts.googleapis.com`
- Background images from Unsplash