# Research: Frontend Task CRUD and State Management

## Overview
This document captures research findings for implementing frontend task CRUD operations with state management in the Next.js application.

## Decisions Made

### 1. Method for Deriving `user_id` from Better Auth Session
**Decision**: Use Better Auth's session API to derive user identity without exposing user ID in URLs
**Rationale**: The authentication system manages user sessions via JWT tokens, and the backend API should infer the user from the session rather than requiring explicit user IDs in URLs. This approach is more secure and aligns with session-based authentication patterns.
**Implementation**: The API client will include session information in requests, and the backend will determine the requesting user from the session context.

### 2. State Management Approach
**Decision**: Use React's built-in useState and useReducer hooks combined with Next.js App Router data fetching
**Rationale**: For this task management feature, React's built-in state management is sufficient without requiring external libraries like Redux. The combination of component-local state and shared state through context provides adequate management for task CRUD operations.
**Implementation**: Local state for form inputs and UI states, shared state for the task list through a custom hook.

### 3. UI Update Strategy After Successful Mutations
**Decision**: Update local state optimistically but with rollback capability on failure
**Rationale**: While the general approach waits for API confirmation, for better user experience, we'll update the UI immediately upon user action but revert changes if the API call fails. This balances responsiveness with data consistency.
**Implementation**: Update UI immediately on user action, then either keep the change on success or revert on failure with visual feedback.

### 4. Error Handling Behavior on Failed Mutations
**Decision**: Implement differentiated error handling based on error type
**Rationale**: Different errors require different user responses - validation errors need field-specific feedback, network errors need connectivity warnings, and authentication errors require login redirection.
**Implementation**: Error interceptor that categorizes errors and triggers appropriate UI responses (field highlighting, toast notifications, redirects).

### 5. Loading and Empty States Handling
**Decision**: Use per-operation loading indicators with clear empty state messaging
**Rationale**: Granular loading indicators provide better user feedback than page-level loading. Clear empty states help guide new users.
**Implementation**: Individual loading spinners for each operation (save buttons, delete icons) and a dedicated empty state illustration for when no tasks exist.

## Technical Details Resolved

### React State Management
- Use `useState` for simple component state
- Use `useReducer` for complex task list state management
- Use `useContext` for sharing task state across components

### Next.js Data Fetching
- Use `fetch` with React's `Suspense` for initial data loading
- Use `useEffect` for subsequent data synchronization
- Implement proper loading and error boundaries

### API Client Integration
- Leverage existing frontend API client
- Add task-specific methods (getTasks, createTask, updateTask, deleteTask)
- Implement proper error handling and response parsing

### Component Structure
- TaskList component for displaying tasks
- TaskItem component for individual task interactions
- TaskForm component for creating/updating tasks
- Loading and Empty state components

## Alternatives Considered

### For State Management:
- Redux Toolkit - rejected as overly complex for this feature
- Zustand - rejected as unnecessary for this scope
- Jotai - rejected for simplicity reasons
- React Query/SWR - considered but not needed for basic CRUD

### For UI Updates:
- Strict server-first (no optimistic updates) - considered but less responsive
- Full optimistic updates without rollback - considered but risky for consistency
- Apollo Client cache updates - rejected as too heavy for this use case

### For Error Handling:
- Generic error messages - rejected for poor UX
- Modal-based error display - rejected for interrupting workflow
- Inline error messages only - rejected for insufficient feedback variety