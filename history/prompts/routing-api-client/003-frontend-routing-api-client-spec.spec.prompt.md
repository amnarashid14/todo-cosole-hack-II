---
id: 3
title: Frontend Routing and API Client Integration Spec
stage: spec
date: 2026-01-16
surface: agent
model: claude-sonnet-4-5-20250929
feature: routing-api-client
branch: 003-routing-api-client
user: hp
command: /sp.specify Frontend Routing and API Client Integration (Next.js App Router)
labels: [routing, api-client, authentication, nextjs]
links:
  spec: ../specs/003-routing-api-client/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - ../specs/003-routing-api-client/spec.md
 - ../specs/003-routing-api-client/checklists/requirements.md
tests:
 - spec validation
---

## Prompt

/sp.specify Frontend Routing and API Client Integration (Next.js App Router)

Target audience:
- Frontend / full-stack developers implementing routing and API access logic

Scope:
- Frontend routing rules and API client setup only
- Authentication mechanism already exists
- Backend API remains unchanged

Routing requirements:
Public routes:
- `/`
- `/login`
- `/register`

Protected routes:
- `/tasks`

Routing rules:
- Unauthenticated access to `/tasks` → redirect to `/login`
- Authenticated access to `/login` or `/register` → redirect to `/tasks`
- Route protection must be enforced in `middleware.ts`

API client requirements:
- Location: `/frontend/lib/api.ts`
- All backend API calls must go through this client
- JWT must be automatically attached to every request
- Authorization header format: `Authorization: Bearer <token>`

Error handling rules:
- `401 Unauthorized` responses → redirect to `/login`
- All other API errors → display error message in UI

Success criteria:
- Route access behaves correctly

## Response snapshot

Specification created for Frontend Routing and API Client Integration feature. The spec includes:

1. User scenarios covering protected and public route access
2. Functional requirements for route protection and API client behavior
3. Success criteria with measurable outcomes
4. Quality checklist validation

Key requirements specified:
- Route protection enforcement in middleware.ts
- Redirect behavior for authenticated/unauthenticated users
- API client implementation with automatic JWT attachment
- Error handling for 401 and other API errors

## Outcome

- ✅ Impact: Created complete feature specification with user scenarios, requirements, and success criteria
- 🧪 Tests: Spec validation completed with checklist
- 📁 Files: spec.md and requirements.md created in specs/003-routing-api-client/
- 🔁 Next prompts: Ready for /sp.plan to create implementation plan
- 🧠 Reflection: Specification covers all required functionality with clear acceptance criteria

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All validation criteria met
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed with planning phase