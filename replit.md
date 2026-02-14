# Baeci Store

## Overview

Baeci Store is a premium BioLink and digital store web application. It serves as a personal/business landing page with social links, a product/service catalog, a community feed (posts), and an admin dashboard for managing site configuration and content. The site is styled with an iOS-inspired dark glassmorphism aesthetic and is primarily targeted at Indonesian-speaking users. It was originally designed for deployment on Vercel.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend
- **Runtime:** Node.js with Express.js (v4.18)
- **Entry point:** `server.js` on port 5000
- **Middleware:** CORS enabled, body-parser for JSON, static file serving from `public/` directory
- **API pattern:** RESTful JSON endpoints under `/api/` prefix
- **Authentication:** Simple password-based admin auth — the admin password is checked against a hardcoded value in `config.js`. No sessions or tokens; the password is sent with each admin request (query param for DELETE, body for POST).

### API Endpoints
- `GET /api/config` — Fetch site settings
- `POST /api/admin/config` — Update site settings (requires admin password in body)
- `GET /api/posts` — Get all posts sorted by date descending
- `POST /api/posts` — Create a new post
- `DELETE /api/admin/posts/:id` — Delete a post (requires admin password as query param)

### Frontend
- **Architecture:** Static HTML pages served from `public/` directory — no frontend framework or build step
- **Styling:** Tailwind CSS via CDN (`cdn.tailwindcss.com`), plus custom CSS for iOS-style glassmorphism effects (backdrop blur, translucent widgets)
- **Fonts/Icons:** Google Fonts (Inter), Font Awesome 6.4 via CDN
- **Key pages:**
  - `index.html` — Main BioLink landing page with profile, links, and navigation
  - `dbadmin.html` — Admin dashboard for site configuration and content management
  - `faq.html` — FAQ page
  - `privacy.html` — Privacy policy page
  - `dashboard.html` — Currently empty
  - `sosial.html` — Currently empty
- **JavaScript:** `public/script.js` exists but is currently empty; inline scripts handle Tailwind config

### Database
- **Database:** MongoDB Atlas (cloud-hosted)
- **Driver:** Native MongoDB Node.js driver (v6.3), NOT Mongoose
- **Database name:** `baeci_store`
- **Collections:**
  - `settings` — Site configuration (single document with `type: 'general'`)
  - `posts` — Community/social feed posts
- **Connection:** Singleton pattern in `db.js` — connects once and reuses the connection

### Deployment
- Originally configured for Vercel (`vercel.json` present) with `@vercel/node` builder
- Routes: API requests go to `server.js`, everything else serves from `public/`

## External Dependencies

### NPM Packages
- `express` (v4.18.2) — Web server framework
- `mongodb` (v6.3.0) — MongoDB native driver
- `body-parser` (v1.20.2) — Request body parsing
- `cors` (v2.8.5) — Cross-origin resource sharing

### External Services
- **MongoDB Atlas** — Cloud database (connection string in `config.js`)
- **Tailwind CSS CDN** — Frontend styling (loaded at runtime, no build step)
- **Google Fonts CDN** — Inter font family
- **Font Awesome CDN** — Icon library
- **Unsplash** — Background wallpaper image loaded from `images.unsplash.com`

### Important Notes
- The `config.js` file contains hardcoded credentials (MongoDB URI and admin password). These should ideally be moved to environment variables.
- Several frontend files (`script.js`, `style.css`, `dashboard.html`, `sosial.html`) are empty and need implementation.
- The `attached_assets/` folder contains HTML snippets that appear to be reference designs for the main page layout.
- The `server.js` file appears truncated — the DELETE endpoint handler is incomplete.