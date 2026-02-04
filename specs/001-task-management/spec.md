# Feature Specification: Secure User-Scoped Task Management REST API

**Feature Branch**: `001-task-management`
**Created**: 2026-01-13
**Status**: Draft
**Input**: User description: "Secure user-scoped Task Management REST API (Backend only) Target audience: Backend engineers building a FastAPI service with JWT-based authentication Context: Backend-only implementation; must be fully testable via Swagger without a frontend"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Authenticate and Access Personal Tasks (Priority: P1)

A backend engineer needs to authenticate using JWT tokens to access their personal task management system. They can create, read, update, and delete their own tasks through a REST API that enforces user isolation.

**Why this priority**: This is the core functionality that enables secure access to the task management system with proper user isolation.

**Independent Test**: Can be fully tested by authenticating with a valid JWT token and performing CRUD operations on tasks, ensuring that users can only access their own tasks and not others'.

**Acceptance Scenarios**:

1. **Given** an authenticated user with valid JWT, **When** they request their tasks via GET /api/tasks, **Then** they receive only their own tasks and no others
2. **Given** an authenticated user with valid JWT, **When** they create a new task via POST /api/tasks, **Then** the task is assigned to their user ID automatically
3. **Given** an authenticated user with valid JWT, **When** they try to access another user's task, **Then** they receive a 403 Forbidden response

---

### User Story 2 - Manage Task Lifecycle (Priority: P1)

A backend engineer needs to perform full CRUD operations on their tasks including toggling completion status, all while maintaining security and data isolation.

**Why this priority**: This provides the complete task management functionality that users expect.

**Independent Test**: Can be fully tested by creating, reading, updating, and deleting tasks with proper authentication and ensuring data isolation is maintained.

**Acceptance Scenarios**:

1. **Given** an authenticated user with valid JWT, **When** they create a task via POST /api/tasks, **Then** the task is created with their user ID and current timestamps
2. **Given** an authenticated user with valid JWT and existing task, **When** they update the task via PUT /api/tasks/{id}, **Then** the task is updated only if it belongs to them
3. **Given** an authenticated user with valid JWT and existing task, **When** they toggle completion via PATCH /api/tasks/{id}/complete, **Then** the task completion status is toggled only if it belongs to them

---

### User Story 3 - Handle Authentication Failures (Priority: P2)

A backend engineer needs to understand authentication failures when using invalid or expired tokens, or when making unauthorized requests.

**Why this priority**: This ensures proper error handling and security posture of the API.

**Independent Test**: Can be fully tested by making requests with invalid JWT tokens, expired tokens, or missing authentication and verifying appropriate HTTP error responses.

**Acceptance Scenarios**:

1. **Given** a request with invalid JWT token, **When** accessing any API endpoint, **Then** the system returns HTTP 401 Unauthorized
2. **Given** a request with expired JWT token, **When** accessing any API endpoint, **Then** the system returns HTTP 401 Unauthorized
3. **Given** a request without authentication header, **When** accessing any API endpoint, **Then** the system returns HTTP 401 Unauthorized

---

### Edge Cases

- What happens when a user tries to access a task that doesn't exist?
- How does the system handle malformed JWT tokens?
- What happens when a user tries to access a task ID that belongs to another user?
- How does the system handle concurrent requests from the same user? (Last-write-wins approach)
- What happens when database connection fails during an operation?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide JWT-based authentication for all API endpoints
- **FR-002**: System MUST verify JWT tokens using BETTER_AUTH_SECRET from environment
- **FR-003**: System MUST reject requests with missing, invalid, or expired JWT tokens with HTTP 401
- **FR-004**: System MUST auto-assign user_id from JWT token when creating new tasks
- **FR-005**: System MUST verify task ownership when accessing, updating, or deleting tasks
- **FR-006**: System MUST return HTTP 403 when users try to access tasks belonging to other users
- **FR-007**: System MUST provide GET /api/tasks endpoint to list authenticated user's tasks
- **FR-008**: System MUST provide POST /api/tasks endpoint to create new tasks with auto-assigned user_id
- **FR-009**: System MUST provide GET /api/tasks/{id} endpoint to fetch individual user's tasks
- **FR-010**: System MUST provide PUT /api/tasks/{id} endpoint to update user's tasks
- **FR-011**: System MUST provide DELETE /api/tasks/{id} endpoint to soft-delete user's tasks (mark as deleted but retain in database)
- **FR-012**: System MUST provide PATCH /api/tasks/{id}/complete endpoint to toggle task completion
- **FR-013**: System MUST store tasks with id, user_id, title, description, completed status, created_at, and updated_at fields
- **FR-014**: System MUST enforce database indexes on user_id and completed fields for performance
- **FR-015**: System MUST connect to PostgreSQL database using DATABASE_URL from environment with asyncpg driver
- **FR-016**: System MUST be testable via Swagger UI without requiring a frontend
- **FR-017**: System MUST ensure cross-user access is impossible through any endpoint
- **FR-018**: System MUST use uv package manager for dependency management and installation

### Key Entities

- **Task**: Represents a user's task with attributes: id (primary key), user_id (from JWT), title (required, auto-generated if not provided), description (optional, max 500 characters), completed status, deleted status, created_at timestamp, updated_at timestamp
- **User**: Identified by JWT token containing user identity information (id, email) used for authentication and authorization
- **JWT Token**: Authentication mechanism that contains user identity and is verified using BETTER_AUTH_SECRET; tokens expire after 24 hours
- **Package Manager**: uv package manager used for dependency management and installation

## Clarifications

### Session 2026-01-13

- Q: Should the title field for tasks be required or optional? → A: Title field should be required but can be auto-generated if not provided
- Q: What should be the character limit for the task description field? → A: Set a reasonable limit like 500 characters
- Q: What should be the expiration timeframe for JWT tokens? → A: Set JWT tokens to expire after 24 hours
- Q: How should concurrent modifications to the same task be handled? → A: Last-write-wins (simple overwrite)
- Q: Should task deletion be permanent or soft-delete? → A: Soft deletion (marked as deleted but retained)
- Q: What package manager should be used for dependency management? → A: Use uv package manager for dependency management and installation

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All API endpoints successfully enforce user isolation - users cannot access tasks belonging to other users
- **SC-002**: API works independently via Swagger UI for manual testing with valid, invalid, and expired JWT tokens
- **SC-003**: JWT authentication system is reusable and centralized without security logic duplicated across routes
- **SC-004**: System correctly returns HTTP 401 for unauthenticated requests and HTTP 403 for unauthorized access attempts
- **SC-005**: Backend service successfully connects to PostgreSQL database and performs all CRUD operations on tasks
- **SC-006**: Task data model includes proper indexes on user_id and completed fields for optimal query performance