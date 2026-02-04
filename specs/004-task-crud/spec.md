# Feature Specification: Frontend Task CRUD and State Management

**Feature Branch**: `004-task-crud`
**Created**: 2026-01-16
**Status**: Draft
**Input**: User description: "Frontend Task CRUD and State Management (Next.js App Router)

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
- API: `GET /api/tasks`
- Display only tasks returned by the API

Task creation:
- API: `POST /api/tasks`
- Required: `title`
- Optional: `description`
- Update UI immediately on success

Task update:
- API: `PUT /api/tasks/{id}`
- Editable fields: `title`, `description`, `completed`
- Reflect changes in UI after success

Task deletion:
- API: `DELETE /api/tasks/{id}`
- Remove task from UI on success

Toggle completion:
- API: `PATCH /api/tasks/{id}/complete`
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
- Task sharing, filtering, or search features"

## Clarifications

### Session 2026-01-16

- Q: Which API endpoint pattern should be used for task operations? → A: Use session-based endpoints without user ID in URL
- Q: How should different types of errors be handled in the UI? → A: Use differentiated error handling by type
- Q: What level of granularity should loading indicators have in the UI? → A: Use per-operation loading indicators
- Q: Should UI updates be optimistic or wait for API confirmation? → A: Wait for API confirmation
- Q: How should task completion toggle handle the visual update vs API confirmation requirement? → A: Visual update immediately but revert on failure

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Task List (Priority: P1)

As an authenticated user, I want to see my tasks when I visit the `/tasks` page so that I can manage my work.

**Why this priority**: This is the core functionality that users need after authentication - viewing their tasks.

**Independent Test**: Can be fully tested by logging in and navigating to `/tasks` and verifying the list of tasks is displayed. Delivers the core value of the application to authenticated users.

**Acceptance Scenarios**:

1. **Given** user is authenticated with tasks in their account, **When** user visits `/tasks` page, **Then** user sees a list of their tasks
2. **Given** user is not authenticated, **When** user attempts to visit `/tasks` page, **Then** user is redirected to login page

---

### User Story 2 - Create New Tasks (Priority: P1)

As an authenticated user, I want to create new tasks so that I can track my work.

**Why this priority**: Basic task management requires the ability to create new tasks.

**Independent Test**: Can be fully tested by creating a new task and verifying it appears in the list after successful creation.

**Acceptance Scenarios**:

1. **Given** user is authenticated and on `/tasks` page, **When** user enters a title and submits new task, **Then** task is created and appears in the task list
2. **Given** user enters invalid task data (e.g., empty title), **When** user submits new task, **Then** error message is displayed and task is not created

---

### User Story 3 - Update Task Details (Priority: P2)

As an authenticated user, I want to update my tasks so that I can keep them current.

**Why this priority**: Allows users to modify task details after creation.

**Independent Test**: Can be fully tested by updating a task and verifying the changes persist in the UI.

**Acceptance Scenarios**:

1. **Given** user is authenticated and has a task, **When** user updates the task title/description, **Then** changes are saved and reflected in the UI
2. **Given** user makes invalid changes to a task, **When** user attempts to save, **Then** error message is displayed and task remains unchanged

---

### User Story 4 - Delete Tasks (Priority: P2)

As an authenticated user, I want to delete tasks I no longer need so that I can keep my list clean.

**Why this priority**: Allows users to remove unwanted tasks.

**Independent Test**: Can be fully tested by deleting a task and verifying it disappears from the list.

**Acceptance Scenarios**:

1. **Given** user is authenticated and has a task, **When** user deletes the task, **Then** task is removed from the UI
2. **Given** user confirms deletion, **When** deletion API call succeeds, **Then** task is permanently removed

---

### User Story 5 - Toggle Task Completion (Priority: P2)

As an authenticated user, I want to mark tasks as complete/incomplete so that I can track my progress.

**Why this priority**: Essential for task management workflow.

**Independent Test**: Can be fully tested by toggling a task's completion status and verifying the change persists.

**Acceptance Scenarios**:

1. **Given** user is authenticated and has a task, **When** user toggles completion status, **Then** the status is updated immediately in the UI
2. **Given** user toggles completion status, **When** API call succeeds, **Then** change is persisted

---

### Edge Cases

- What happens when network is unavailable during task operations?
- How does the system handle concurrent modifications to the same task?
- What occurs when the JWT token expires during task operations?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST load tasks from API when `/tasks` page mounts
- **FR-002**: System MUST display only tasks belonging to the authenticated user
- **FR-003**: System MUST prevent task display for unauthenticated users
- **FR-004**: System MUST allow creation of tasks with required `title` field
- **FR-005**: System MUST allow optional `description` field when creating tasks
- **FR-006**: System MUST update UI after successful API response (not immediately)
- **FR-007**: System MUST allow updating task `title`, `description`, and `completed` fields
- **FR-008**: System MUST reflect task updates in UI after successful API response
- **FR-009**: System MUST remove task from UI after successful deletion
- **FR-010**: System MUST toggle completion state visually in UI immediately when user interacts, but revert if API call fails
- **FR-011**: System MUST use existing API client for all backend communications
- **FR-012**: System MUST never manually store or handle JWT tokens
- **FR-013**: System MUST follow API endpoints pattern: `/api/{resource}` with user inferred from session
- **FR-014**: System MUST reload tasks only on mutation failure, not on success
- **FR-015**: System MUST implement differentiated error handling (validation errors show field-specific messages, network errors show connectivity warnings, auth errors redirect to login)
- **FR-016**: System MUST implement per-operation loading indicators (e.g., spinner on submit button, skeleton loaders for task items)

### Key Entities *(include if feature involves data)*

- **Task**: Represents a user's work item with properties (id, title, description, completed status, user association)
- **Task List**: Collection of tasks belonging to a specific authenticated user

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Authenticated users can see their task list within 3 seconds of loading `/tasks` page
- **SC-002**: Users can create new tasks that appear in the list within 1 second of successful submission
- **SC-003**: Task completion toggles update visually in under 0.5 seconds with potential to revert on API failure
- **SC-004**: Unauthenticated users attempting to access `/tasks` are redirected to login within 1 second
- **SC-005**: All CRUD operations show appropriate loading and error states to the user
- **SC-006**: Task state remains consistent between frontend and backend after all operations
- **SC-007**: No manual JWT handling or storage occurs in the frontend implementation