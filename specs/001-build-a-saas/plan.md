# Implementation Plan: AI Product Image Generator

**Branch**: `001-build-a-saas` | **Date**: 2025-09-16 | **Spec**: C:\Users\xanthi\Desktop\apps\speckit-app\specs\001-build-a-saas\spec.md
**Input**: Feature specification from `/specs/001-build-a-saas/spec.md`

## Execution Flow (/plan command scope)

```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

From the feature spec: Authenticated users upload a model photo and a product photo, select a category, and receive a combined advertising image generated via an external n8n webhook, presented as base64 with download capability. The plan leverages Next.js 15 + TypeScript, Clerk auth, Zod validation, and a secure server-mediated webhook call with a strict 5-minute timeout, accessibility and responsiveness as first-class requirements, and no server-side persistence of images in v1.

## Technical Context

**Language/Version**: TypeScript (Node 18+), React 18, Next.js 15 (App Router)  
**Primary Dependencies**: Next.js, React, Tailwind CSS 3.4, shadcn/ui, Lucide, Framer Motion, React Hook Form, Zod, TanStack Query, Prisma (optional v1), @clerk/nextjs, upstash/ratelimit, react-dropzone, sharp  
**Storage**: PostgreSQL via Prisma (metadata only in v1; no image storage per spec)  
**Testing**: Jest + React Testing Library; Playwright for E2E; API integration tests  
**Target Platform**: Vercel (Next.js App Router), single region initial  
**Project Type**: web (frontend + backend in a single Next.js app)  
**Performance Goals**: Page load < 3s; generation wait ≤ 5 minutes; responsive and accessible UI  
**Constraints**: Max file size 10MB each; allowed MIME types: image/jpeg, image/png, image/webp; max dimensions 4096×4096; HTTPS; rate limiting 5 req/min/user  
**Scale/Scope**: Initial release, single region; concurrency governed by rate limiting; future credits/history out-of-scope

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Test-First: Plan includes contract tests and integration scenarios before implementation (PASS)
- Simplicity: Single Next.js app; no extra services beyond required webhook (PASS)
- Security: No client-side secrets; HTTPS only; rate limiting and auth gating (PASS)
- Observability: Health endpoint and structured error payloads planned (PASS)
- Versioning/Breaking changes: Contracts defined up-front; non-breaking evolutions planned (PASS)

## Project Structure

### Documentation (this feature)

```
specs/001-build-a-saas/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

```
# Web application (frontend + backend in Next.js)
app/ (App Router)
components/
lib/
prisma/
public/

# Tests
__tests__/
```

**Structure Decision**: Web application structure (Next.js single app) per project type

## Phase 0: Outline & Research

- Unknowns resolved in research.md: accessibility acceptance specifics, MIME types, download format + naming, rate limiting policy, cancellation behavior, retention policy, content policy, webhook authentication handling, timeout approach.
- Best practices gathered for: Next.js App Router file uploads, Clerk with App Router, Upstash rate limits, handling base64 images, sharp optimizations, Zod + React Hook Form integration, n8n webhook timeouts.

**Output**: research.md with all decisions and rationales

## Phase 1: Design & Contracts

- Data model focuses on ephemeral, session-based processing (no image persistence). Optional metadata-only records considered for future.
- API contracts defined for /api/generate, /api/health, and optional /api/webhook/callback (not used in v1).
- Quickstart includes environment configuration and run guidance.
- Agent context updated for Copilot using update-agent-context.ps1.

**Output**: data-model.md, contracts/openapi.yaml, quickstart.md, updated agent file

## Phase 2: Task Planning Approach

- Load tasks template; derive tasks from contracts and entities.
- TDD ordering: contract tests → models/services → UI.
- Mark parallelizable tasks [P] and sequence dependencies.

## Complexity Tracking

(none required; constitution check passed)

## Progress Tracking

**Phase Status**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---

_Based on Constitution v2.1.1 - See `/memory/constitution.md`_
