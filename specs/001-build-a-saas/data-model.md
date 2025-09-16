# Data Model (Phase 1)

> v1 avoids persisting images; optional metadata-only records are outlined for future.

## Entities

### User (external auth via Clerk)

- id (string, cuid)
- clerkId (string)
- email (string)
- profile: firstName?, lastName?, imageUrl?
- tier: FREE | PRO | ENTERPRISE (future)
- credits (future)

### Generation (optional metadata record)

- id (string, cuid)
- userId (string)
- category (enum: ECOMMERCE | FASHION | JEWELRY | TECHNOLOGY | BEAUTY)
- status (enum: PENDING | PROCESSING | COMPLETED | FAILED | TIMEOUT)
- error? (string)
- processingTime? (number ms)
- createdAt (Date)
- completedAt? (Date)
- webhookPayload? (json) — sanitized subset
- webhookResponse? (json) — sanitized subset

## Validation Rules

- Image files: MIME in {image/jpeg, image/png, image/webp}, size ≤ 10MB, dims ≤ 4096×4096.
- Category required before upload/generation.
- Exactly two uploads: model + product.
- Timeout: 300s; on exceed → TIMEOUT.

## State Transitions

- PENDING → PROCESSING → COMPLETED | FAILED | TIMEOUT
- Cancel action: PROCESSING → FAILED (client cancel) [no persistence in v1]
