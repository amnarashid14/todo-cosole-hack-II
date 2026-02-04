---
id: 3
title: Frontend Routing and API Client Integration Plan
stage: plan
date: 2026-01-16
surface: agent
model: claude-sonnet-4-5-20250929
feature: routing-api-client
branch: 003-routing-api-client
user: hp
command: /sp.plan
labels: [routing, api-client, authentication, nextjs, middleware]
links:
  spec: ../specs/003-routing-api-client/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - ../specs/003-routing-api-client/plan.md
 - ../specs/003-routing-api-client/research.md
 - ../specs/003-routing-api-client/data-model.md
 - ../specs/003-routing-api-client/quickstart.md
 - ../specs/003-routing-api-client/contracts/api-contracts.md
tests:
 - plan validation
 - constitution check
---

## Prompt

/sp.plan

Create:
- Frontend routing architecture sketch (public vs protected routes)
- Middleware-based route protection flow using `middleware.ts`
- API client architecture for centralized backend communication
- Stepwise implementation plan for routing enforcement and API client usage
- Quality validation checklist mapped to success criteria

Decisions needing documentation:
- Middleware strategy for detecting authenticated vs unauthenticated state
- Redirect handling logic and edge cases (direct URL access, refresh)
- API client design (fetch wrapper vs abstraction layer)
- JWT retrieval method from existing frontend auth/session
- Centralized vs per-request error handling approach

Testing strategy:
- Public route accessibility without authentication (`/`, `/login`, `/register`)
- Protected route access control (`/tasks`)
- Redirect behavior for unauthenticated users accessing protected routes
- Redirect behavior for authenticated users accessing auth pages
- Middleware execution consistency on navigation and refresh
- API requests include `Authorization: Bearer <token>` header
- `401 Unauthorized` responses trigger redirect to `/login`
- Non-401 API errors surface user-visible error messages
- Verification that no backend calls bypass the API client

Technical details:
- Framework: Next.js 16+ (App Router)
- Language: TypeScript
- Routing enforcement via `middleware.ts`
- API client location: `/frontend/lib/api.ts`
- Authentication source: existing frontend auth/session
- Backend API remains unchanged

Execution approach:
- Research-concurrent implementation (reference Next.js middleware and auth docs while building)
- Organize work by phases:
  1. Routing requirements analysis
  2. Middleware implementation
  3. API client construction
  4. Error handling integration
  5. Validation and cleanup

## Response snapshot

Complete implementation plan created for Frontend Routing and API Client Integration feature. The plan includes:

1. Comprehensive technical context with Next.js, TypeScript, and better-auth integration
2. Detailed research findings resolving all unknowns about middleware strategy, API client design, and error handling
3. Data model defining authentication tokens, API request/response objects, and route protection rules
4. Quickstart guide for developers to understand and use the new features
5. API contracts specifying the interface and behavior of the centralized API client
6. Constitution check validation ensuring compliance with project principles

Key architectural decisions documented:
- Next.js middleware for route protection with proper matcher configuration
- Centralized API client as fetch wrapper with automatic JWT injection
- Centralized error handling for 401 redirects and other error messages
- Integration with existing better-auth authentication system

## Outcome

- ✅ Impact: Created complete implementation plan with architecture, data models, and contracts
- 🧪 Tests: Constitution check validated all project principles
- 📁 Files: plan.md, research.md, data-model.md, quickstart.md, and api-contracts.md created
- 🔁 Next prompts: Ready for /sp.tasks to generate implementation tasks
- 🧠 Reflection: Plan addresses all requirements with proper architecture decisions

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All validation criteria met
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed with task generation phase