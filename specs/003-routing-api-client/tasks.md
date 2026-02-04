# Tasks: Frontend Routing and API Client Integration

**Feature**: Frontend Routing and API Client Integration
**Branch**: 003-routing-api-client
**Created**: 2026-01-16
**Input**: Spec and design artifacts from `/specs/003-routing-api-client/`

## Implementation Strategy

Deliver incrementally with each user story forming a complete, independently testable increment. Start with User Story 1 (Access Protected Routes) as MVP, then add public route access, authenticated API calls, and error handling.

## Dependencies

User stories are mostly independent, but:
- US3 (Authenticated API calls) requires the API client implemented in US3
- US4 (Error handling) builds on the API client from US3

## Parallel Execution Opportunities

- [US2] Public route pages can be developed in parallel: `/`, `/login`, `/register`
- API client methods can be implemented in parallel after base structure: [P] [US3] `api.get()`, [P] [US3] `api.post()`, [P] [US3] `api.put()`, [P] [US3] `api.delete()`

---

## Phase 1: Setup

- [X] T001 Set up middleware configuration in project root
- [X] T002 Prepare frontend/lib directory for API client

## Phase 2: Foundational

- [X] T003 Create authentication utility functions for token retrieval
- [X] T004 Define API response types in `/frontend/types/api.ts`

## Phase 3: User Story 1 - Access Protected Routes (Priority: P1)

**Goal**: As an authenticated user, I want to access protected `/tasks` route so that I can view and manage my tasks.

**Independent Test**: Can be fully tested by logging in and navigating to `/tasks` and verifying access is granted. Delivers the core value of the application to authenticated users.

**Acceptance Scenarios**:
1. **Given** user is logged in with valid session, **When** user navigates to `/tasks`, **Then** user sees the tasks page without being redirected
2. **Given** user is not logged in, **When** user attempts to navigate to `/tasks`, **Then** user is redirected to `/login`

- [X] T005 [US1] Create middleware.ts with route protection logic for `/tasks`
- [X] T006 [US1] Configure middleware matcher to protect `/tasks` route
- [X] T007 [US1] Implement authentication check using better-auth session
- [X] T008 [US1] Add redirect to `/login` for unauthenticated access to `/tasks`
- [X] T009 [US1] Test protected route access with authenticated user

## Phase 4: User Story 2 - Access Public Routes (Priority: P1)

**Goal**: As a visitor, I want to access public routes like home, login, and register so that I can either sign in or create an account.

**Independent Test**: Can be fully tested by navigating to `/`, `/login`, and `/register` without authentication and verifying access is granted.

**Acceptance Scenarios**:
1. **Given** user is not logged in, **When** user navigates to `/`, `/login`, or `/register`, **Then** user can access these pages without redirection
2. **Given** user is logged in, **When** user navigates to `/login` or `/register`, **Then** user is redirected to `/tasks`

- [X] T010 [US2] Update middleware.ts to allow access to public routes (`/`, `/login`, `/register`)
- [X] T011 [P] [US2] Create public home page at `/frontend/app/page.tsx`
- [X] T012 [P] [US2] Create login page at `/frontend/app/login/page.tsx`
- [X] T013 [P] [US2] Create register page at `/frontend/app/register/page.tsx`
- [X] T014 [US2] Add redirect logic from authenticated `/login` and `/register` to `/tasks`
- [X] T015 [US2] Test public route accessibility without authentication

## Phase 5: User Story 3 - Make Authenticated API Calls (Priority: P2)

**Goal**: As an authenticated user, I want API calls to automatically include my JWT token so that I can interact with protected backend services.

**Independent Test**: Can be fully tested by making API calls through the client and verifying JWT headers are automatically attached.

**Acceptance Scenarios**:
1. **Given** user is authenticated with JWT token, **When** any API call is made through the client, **Then** the `Authorization: Bearer <token>` header is automatically included
2. **Given** API call returns 401 Unauthorized, **When** error occurs, **Then** user is redirected to `/login`

- [X] T016 [US3] Create API client at `/frontend/lib/api.ts`
- [X] T017 [P] [US3] Implement base API request function with authentication header
- [X] T018 [P] [US3] Implement `api.get()` method with automatic JWT token attachment
- [X] T019 [P] [US3] Implement `api.post()` method with automatic JWT token attachment
- [X] T020 [P] [US3] Implement `api.put()` method with automatic JWT token attachment
- [X] T021 [P] [US3] Implement `api.delete()` method with automatic JWT token attachment
- [X] T022 [US3] Integrate JWT token retrieval from better-auth session
- [X] T023 [US3] Test automatic JWT attachment in API requests

## Phase 6: User Story 4 - Handle API Errors Gracefully (Priority: P3)

**Goal**: As a user, I want to see appropriate error messages when API calls fail so that I understand what went wrong.

**Independent Test**: Can be tested by simulating API failures and verifying appropriate error messages are displayed.

**Acceptance Scenarios**:
1. **Given** API call fails with non-401 error, **When** error occurs, **Then** appropriate error message is displayed to user without redirect

- [X] T024 [US4] Add 401 Unauthorized error handling to API client
- [X] T025 [US4] Implement redirect to `/login` on 401 responses
- [X] T026 [US4] Add error message handling for non-401 API errors
- [X] T027 [US4] Create error display utility for API error messages
- [X] T028 [US4] Test 401 redirect behavior
- [X] T029 [US4] Test non-401 error message display

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T030 Update middleware configuration to handle all route protection rules
- [X] T031 Add comprehensive error boundaries to handle unexpected errors
- [X] T032 Add proper loading states for API calls
- [X] T033 Add proper TypeScript types for all API interactions
- [X] T034 Update documentation with new routing and API client usage
- [X] T035 Conduct end-to-end testing of all route protection and API call scenarios