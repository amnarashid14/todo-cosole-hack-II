---
id: 4
title: Frontend Task CRUD and State Management Spec
stage: spec
date: 2026-01-16
surface: agent
model: claude-sonnet-4-5-20250929
feature: task-crud
branch: 004-task-crud
user: hp
command: /sp.specify Frontend Task CRUD and State Management (Next.js App Router)
labels: [task-crud, frontend, nextjs, authentication, api]
links:
  spec: ../specs/004-task-crud/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - ../specs/004-task-crud/spec.md
 - ../specs/004-task-crud/checklists/requirements.md
tests:
 - spec validation
---

## Prompt

/sp.specify Frontend Task CRUD and State Management (Next.js App Router)

Target audience:
- Frontend / full-stack developers implementing authenticated task CRUD

Scope:
- Frontend task CRUD functionality and state management
- Authentication already implemented via Better Auth
- Backend API remains unchanged

Preconditions:
- User must be authenticated
- JWT available from Better Auth session
- Authentication state source of truth is Better Auth session
- JWT must never be manually stored

Task listing:
- Trigger: `/tasks` page mount
- API: `GET /api/{user_id}/tasks`
- Display only tasks returned by the API

Task creation:
- API: `POST /api/{user_id}/tasks`
- Required: `title`
- Optional: `description`
- Update UI immediately on success

Task update:
- API: `PUT /api/{user_id}/tasks/{id}`
- Editable fields: `title`, `description`, `completed`
- Reflect changes in UI after success

Task deletion:
- API: `DELETE /api/{user_id}/tasks/{id}`
- Remove task from UI on success

Toggle completion:
- API: `PATCH /api/{user_id}/tasks/{id}/complete`
- Reflect updated completion state immediately

State management rules:
- Task state loads once on `/tasks` mount
- Task state updates only after successful mutations
- Refetch tasks only on mutation failure
- No redundant or background polling

Success criteria:
- Tasks load correctly for authenticated users
- All CRUD operations update UI accurately
- Completion toggle reflects state immediately
- No task data shown for unauthenticated users
- JWT is never manually handled or persisted
- Frontend state stays consistent with backend responses

Constraints:
- Framework: Next.js 16+ (App Router)
- Language: TypeScript
- API access via existing frontend API client
- Output: Production-ready task CRUD implementation

Not building:
- Backend task logic or API changes
- Offline support or optimistic conflict resolution
- Advanced state libraries (Redux, Zustand, etc.)
- Task sharing, filtering, or search features

## Response snapshot

Specification created for Frontend Task CRUD and State Management feature. The spec includes:

1. User scenarios covering task listing, creation, update, deletion, and completion toggling
2. Functional requirements for all CRUD operations and state management
3. Success criteria with measurable outcomes
4. Quality checklist validation

Key requirements specified:
- Task state loads once on `/tasks` page mount
- All CRUD operations update UI immediately on success
- Proper authentication validation using Better Auth session
- No manual JWT handling or storage
- API endpoint patterns following `/api/{user_id}/tasks`

## Outcome

- ✅ Impact: Created complete feature specification with user scenarios, requirements, and success criteria
- 🧪 Tests: Spec validation completed with checklist
- 📁 Files: spec.md and requirements.md created in specs/004-task-crud/
- 🔁 Next prompts: Ready for /sp.plan to create implementation plan
- 🧠 Reflection: Specification covers all required functionality with clear acceptance criteria

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All validation criteria met
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed with planning phase