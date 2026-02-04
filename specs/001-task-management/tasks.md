# Tasks: Secure User-Scoped Task Management REST API

**Feature**: Secure User-Scoped Task Management REST API
**Branch**: 001-task-management
**Generated from**: specs/001-task-management/plan.md, specs/001-task-management/spec.md, and related documents

## Implementation Strategy

**MVP Approach**: Implement User Story 1 first (authentication and basic task access) as a complete, testable increment before moving to other stories.

**Development Flow**:
- Phase 1: Project setup and foundational components
- Phase 2: Core authentication and authorization layer
- Phase 3: User Story 1 (P1) - Authenticate and Access Personal Tasks
- Phase 4: User Story 2 (P1) - Manage Task Lifecycle
- Phase 5: User Story 3 (P2) - Handle Authentication Failures
- Phase 6: Polish and cross-cutting concerns

**Parallel Execution**: Tasks marked with [P] can be executed in parallel if they modify different files/components.

## Dependencies

- **User Story 2** depends on **User Story 1** (requires authentication foundation)
- **User Story 3** depends on **User Story 1** (requires authentication foundation)
- All stories depend on Phase 1 (Setup) and Phase 2 (Foundational) completion

## Parallel Execution Examples

- **User Story 1**: [P] Create Task model, [P] Create JWT handler, [P] Create auth dependency
- **User Story 2**: [P] Create Task update endpoint, [P] Create Task delete endpoint, [P] Create Task completion endpoint

## Phase 1: Setup

Initialize project structure and install dependencies using uv package manager.

- [X] T001 Create backend directory structure: backend/src/, backend/tests/, backend/requirements.txt
- [X] T002 Create backend/src/__init__.py file
- [X] T003 Create backend/src/main.py with basic FastAPI app
- [X] T004 Create backend/src/config/__init__.py file
- [X] T005 Create backend/src/models/__init__.py file
- [X] T006 Create backend/src/schemas/__init__.py file
- [X] T007 Create backend/src/auth/__init__.py file
- [X] T008 Create backend/src/api/__init__.py file
- [X] T009 Create backend/src/api/v1/__init__.py file
- [X] T010 Create backend/src/utils/__init__.py file
- [X] T011 Create backend/tests/__init__.py file
- [X] T012 Install uv package manager and verify installation
- [X] T013 Install all dependencies using uv from requirements.txt

## Phase 2: Foundational Components

Implement core infrastructure components that all user stories depend on.

- [X] T014 [P] Create database configuration in backend/src/config/database.py
- [X] T015 [P] Create settings configuration in backend/src/config/settings.py
- [X] T016 [P] Create Task SQLModel in backend/src/models/task.py
- [X] T017 [P] Create Task schemas in backend/src/schemas/task.py
- [X] T018 [P] Create JWT utility functions in backend/src/auth/jwt_handler.py
- [X] T019 [P] Create auth dependency in backend/src/auth/dependencies.py
- [X] T020 [P] Create security utilities in backend/src/utils/security.py
- [X] T021 Create database initialization function to create tables
- [X] T022 Update main.py to include database configuration and initialization

## Phase 3: [US1] Authenticate and Access Personal Tasks (Priority: P1)

Implement the core functionality for users to authenticate and access their personal tasks with proper user isolation.

**Goal**: Backend engineer can authenticate using JWT tokens to access their personal task management system, performing CRUD operations on their own tasks through a REST API that enforces user isolation.

**Independent Test**: Can be fully tested by authenticating with a valid JWT token and performing CRUD operations on tasks, ensuring that users can only access their own tasks and not others'.

- [X] T023 [P] [US1] Create GET /api/tasks endpoint to list user's tasks in backend/src/api/v1/tasks.py
- [X] T024 [P] [US1] Create POST /api/tasks endpoint to create new tasks in backend/src/api/v1/tasks.py
- [X] T025 [P] [US1] Create GET /api/tasks/{id} endpoint to fetch individual user's tasks in backend/src/api/v1/tasks.py
- [X] T026 [P] [US1] Create authentication middleware to verify JWT tokens
- [X] T027 [US1] Test that authenticated user can access their own tasks via GET /api/tasks
- [X] T028 [US1] Test that task creation assigns user_id from JWT automatically
- [X] T029 [US1] Test that users receive 403 Forbidden when accessing another user's task
- [X] T030 [US1] Implement user_id extraction from JWT and verify task ownership

## Phase 4: [US2] Manage Task Lifecycle (Priority: P1)

Implement full CRUD operations on tasks including toggling completion status, all while maintaining security and data isolation.

**Goal**: Backend engineer can perform full CRUD operations on their tasks including toggling completion status, all while maintaining security and data isolation.

**Independent Test**: Can be fully tested by creating, reading, updating, and deleting tasks with proper authentication and ensuring data isolation is maintained.

- [X] T031 [P] [US2] Create PUT /api/tasks/{id} endpoint to update user's tasks in backend/src/api/v1/tasks.py
- [X] T032 [P] [US2] Create DELETE /api/tasks/{id} endpoint to soft-delete user's tasks in backend/src/api/v1/tasks.py
- [X] T033 [P] [US2] Create PATCH /api/tasks/{id}/complete endpoint to toggle task completion in backend/src/api/v1/tasks.py
- [X] T034 [US2] Test that authenticated user can create a task with their user ID and current timestamps
- [X] T035 [US2] Test that authenticated user can update their task only if it belongs to them
- [X] T036 [US2] Test that authenticated user can toggle completion status only if task belongs to them
- [X] T037 [US2] Implement soft-delete functionality that marks tasks as deleted but retains in database
- [X] T038 [US2] Implement completion status toggle that updates only for owner's tasks

## Phase 5: [US3] Handle Authentication Failures (Priority: P2)

Implement proper error handling for authentication failures when using invalid or expired tokens.

**Goal**: Backend engineer understands authentication failures when using invalid or expired tokens, or when making unauthorized requests.

**Independent Test**: Can be fully tested by making requests with invalid JWT tokens, expired tokens, or missing authentication and verifying appropriate HTTP error responses.

- [X] T039 [P] [US3] Implement error handling for missing JWT tokens
- [X] T040 [P] [US3] Implement error handling for invalid JWT tokens
- [X] T041 [P] [US3] Implement error handling for expired JWT tokens
- [X] T042 [US3] Test that requests with invalid JWT tokens return HTTP 401 Unauthorized
- [X] T043 [US3] Test that requests with expired JWT tokens return HTTP 401 Unauthorized
- [X] T044 [US3] Test that requests without authentication header return HTTP 401 Unauthorized
- [X] T045 [US3] Create proper error response schemas and messages

## Phase 6: Polish & Cross-Cutting Concerns

Final implementation details and cross-cutting concerns.

- [X] T046 Add database indexes for user_id and completed fields as specified
- [X] T047 Implement proper logging for security events
- [X] T048 Add input validation for task title (required, max 255 chars) and description (optional, max 500 chars)
- [X] T049 Create .env.example file with required environment variables
- [X] T050 Update main.py to include all API routes
- [X] T051 Add proper timestamp generation and update mechanisms
- [X] T052 Create README with setup and usage instructions
- [X] T053 Add comprehensive error handling for edge cases (non-existent tasks, database failures)
- [X] T054 Test that cross-user access returns 403 Forbidden as specified
- [X] T055 Verify that no endpoint accepts user_id as input parameter
- [X] T056 Test data persistence in PostgreSQL database with asyncpg driver
- [X] T057 Ensure all routes are protected by auth dependency
- [X] T058 Verify JWT tokens expire after 24 hours as specified
- [X] T059 Implement last-write-wins approach for concurrent modifications
- [X] T060 Final validation that all API endpoints enforce user isolation