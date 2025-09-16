# Research: AI Product Image Generator (Phase 0)

## Decisions and Rationale

1. Allowed MIME types: image/jpeg, image/png, image/webp
   - Rationale: Broad browser compatibility; efficient compression (WebP).
   - Alternatives: AVIF (higher compression) deferred due to varying support; HEIC excluded for compatibility.

2. Download format and naming: PNG; filename AI-Product-Image-YYYYMMDD-HHMMSS.png
   - Rationale: Lossless output for quality; predictable filenames.
   - Alternatives: JPG (smaller files) rejected to avoid additional compression artifacts.

3. Accessibility acceptance criteria (WCAG 2.1 AA highlights)
   - Keyboard-only navigation, visible focus, alt text, contrast ≥ 4.5:1, accessible names, announced errors.
   - Rationale: Meets acceptance criteria in spec; pragmatic and testable.

4. External webhook authentication: server-held secret/credential only
   - Rationale: Prevent client-side secret exposure; enables future rotation.
   - Alternatives: Client-signed requests rejected to avoid secret leakage.

5. Cancellation behavior
   - Decision: Allow cancel; discard any late result; require resubmission.
   - Rationale: Simplifies state and avoids ghost updates.

6. Retention policy
   - Decision: No server-side storage; session-only retention.
   - Rationale: Privacy-first; aligns with spec.

7. Content policy
   - Decision: Block nudity/sexual content, hate symbols, graphic violence, illegal activities/drugs, sensitive documents.
   - Rationale: Compliance and safety; clear boundaries for v1.

8. Rate limit: 5 requests/min/user on /api/generate
   - Rationale: Prevent abuse and manage webhook capacity.

9. Timeout handling: 300s overall; clear timeout message and retry guidance
   - Rationale: Mirrors external limit; avoids hanging requests.

10. Client upload handling
    - Decision: Validate size and MIME on client; optional pre-compress for very large images; cap dimensions at 4096×4096.
    - Rationale: Better UX and avoids wasted bandwidth.

## Best Practices Summaries
- Next.js App Router uploads: use Request.formData() or base64 via JSON; avoid streaming secrets to client.
- Clerk on App Router: use middleware for route protection; server-side auth checks in API routes.
- Upstash Ratelimit: token bucket per userId; return 429 with Retry-After.
- n8n webhook: send category and base64 images; handle 202/200; ensure HTTPS.
- Sharp: sanitize, resize, and re-encode when needed; guard against zip-bombs.
- Zod + React Hook Form: zodResolver; consistent error messages.

## Remaining Risks
- Long-running external processing variability (spikes).
- Content policy enforcement accuracy (false positives/negatives) — keep messages non-accusatory.
- Mobile data usage for large images — rely on client-side checks/compression.
