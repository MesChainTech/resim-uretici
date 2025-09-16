# Quickstart (Phase 1)

## Prerequisites
- Node 18+
- pnpm or npm
- Vercel account (optional for deployment)
- PostgreSQL (local via Docker or hosted)

## Setup
1. Copy .env.example → .env.local and set values per spec (Clerk, DB, n8n, Upstash).
2. Install deps and run dev server.
3. Ensure n8n webhook URL and timeout are correct.

## Validate
- Health: GET /api/health → { status: "ok" }
- Auth: Protected route redirects to sign-in when unauthenticated.
- Generate flow: Category + two images → response within 5 minutes → base64 image shown → download works.

## Notes
- No persistent storage of images in v1.
- Rate limit 5 req/min/user on /api/generate.
- Accessibility checks (keyboard nav, focus, contrast, alt text, announced errors).
