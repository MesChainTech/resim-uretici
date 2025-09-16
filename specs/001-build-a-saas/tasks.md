# Tasks: AI Product Image Generator

**Input**: Design documents from `/specs/001-build-a-saas/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Next.js App Router**: `app/`, `components/`, `lib/` at repository root
- **Tests**: `__tests__/` at repository root
- All paths shown below are absolute from repository root

## Phase 3.1: Setup
- [ ] T001 Create Next.js 15 project structure with TypeScript, Tailwind CSS, and shadcn/ui setup
- [ ] T002 Install dependencies: @clerk/nextjs, zod, react-hook-form, @tanstack/react-query, prisma, upstash/ratelimit, react-dropzone, sharp, framer-motion, lucide-react
- [ ] T003 [P] Configure ESLint, Prettier, and TypeScript settings
- [ ] T004 [P] Create .env.example with required environment variables
- [ ] T005 [P] Initialize Prisma schema in prisma/schema.prisma (optional metadata model)

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T006 [P] Contract test GET /api/health in __tests__/contract/health.test.ts
- [ ] T007 [P] Contract test POST /api/generate in __tests__/contract/generate.test.ts
- [ ] T008 [P] Integration test authentication flow in __tests__/integration/auth.test.ts
- [ ] T009 [P] Integration test image generation flow in __tests__/integration/generation.test.ts
- [ ] T010 [P] Integration test file upload validation in __tests__/integration/upload.test.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T011 [P] Create Zod schemas for validation in lib/schemas.ts
- [ ] T012 [P] Create rate limiting utility in lib/rate-limit.ts
- [ ] T013 [P] Create image processing utilities in lib/image-utils.ts
- [ ] T014 [P] Create webhook client for n8n in lib/webhook-client.ts
- [ ] T015 [P] Create error handling utilities in lib/errors.ts
- [ ] T016 GET /api/health endpoint in app/api/health/route.ts
- [ ] T017 POST /api/generate endpoint in app/api/generate/route.ts
- [ ] T018 [P] Create category selector component in components/generator/category-selector.tsx
- [ ] T019 [P] Create image uploader component in components/generator/image-uploader.tsx
- [ ] T020 [P] Create loading overlay component in components/generator/loading-overlay.tsx
- [ ] T021 [P] Create result display component in components/generator/result-display.tsx
- [ ] T022 [P] Create download button component in components/generator/download-button.tsx

## Phase 3.4: Integration
- [ ] T023 Create Clerk authentication middleware in middleware.ts
- [ ] T024 Create main generator page in app/(dashboard)/generate/page.tsx
- [ ] T025 Create authentication layout in app/(auth)/layout.tsx
- [ ] T026 [P] Create sign-in page in app/(auth)/sign-in/[[...sign-in]]/page.tsx
- [ ] T027 [P] Create sign-up page in app/(auth)/sign-up/[[...sign-up]]/page.tsx
- [ ] T028 Create landing page in app/(marketing)/page.tsx
- [ ] T029 [P] Create header component in components/layout/header.tsx
- [ ] T030 [P] Create footer component in components/layout/footer.tsx
- [ ] T031 [P] Create how-to-use section in components/sections/how-to-use.tsx
- [ ] T032 [P] Create pricing section in components/sections/pricing.tsx

## Phase 3.5: Polish
- [ ] T033 [P] Unit tests for validation schemas in __tests__/unit/schemas.test.ts
- [ ] T034 [P] Unit tests for image utilities in __tests__/unit/image-utils.test.ts
- [ ] T035 [P] Unit tests for webhook client in __tests__/unit/webhook-client.test.ts
- [ ] T036 [P] E2E tests with Playwright in __tests__/e2e/generation-flow.spec.ts
- [ ] T037 [P] Accessibility tests in __tests__/e2e/accessibility.spec.ts
- [ ] T038 [P] Performance optimization and image compression
- [ ] T039 [P] Error boundary implementation
- [ ] T040 [P] Update README.md with setup and usage instructions

## Dependencies
- Setup (T001-T005) before all other phases
- Tests (T006-T010) before implementation (T011-T032)
- Core utilities (T011-T015) before API endpoints (T016-T017)
- Components (T018-T022) before page integration (T024-T032)
- Authentication setup (T023) before protected pages (T024)
- Implementation before polish (T033-T040)

## Parallel Example
```
# Launch contract tests together (after setup):
Task: "Contract test GET /api/health in __tests__/contract/health.test.ts"
Task: "Contract test POST /api/generate in __tests__/contract/generate.test.ts" 
Task: "Integration test authentication flow in __tests__/integration/auth.test.ts"
Task: "Integration test image generation flow in __tests__/integration/generation.test.ts"
Task: "Integration test file upload validation in __tests__/integration/upload.test.ts"

# Launch core utilities together (after tests fail):
Task: "Create Zod schemas for validation in lib/schemas.ts"
Task: "Create rate limiting utility in lib/rate-limit.ts"
Task: "Create image processing utilities in lib/image-utils.ts"
Task: "Create webhook client for n8n in lib/webhook-client.ts"
Task: "Create error handling utilities in lib/errors.ts"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Focus on accessibility from the start (keyboard nav, focus, contrast, alt text)
- Ensure rate limiting (5 req/min/user) and proper error handling
- No server-side image persistence per spec

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - /api/health → contract test task [P]
   - /api/generate → contract test task [P]
   - Each endpoint → implementation task
   
2. **From Data Model**:
   - Validation rules → schema creation task [P]
   - Optional metadata → Prisma setup task [P]
   
3. **From User Stories**:
   - Authentication flow → integration test [P]
   - Generation flow → integration test [P]
   - Upload validation → integration test [P]

4. **Ordering**:
   - Setup → Tests → Core → Components → Pages → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contracts have corresponding tests
- [x] All entities have model/schema tasks
- [x] All tests come before implementation
- [x] Parallel tasks truly independent
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task