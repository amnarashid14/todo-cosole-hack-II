# Quickstart Guide: Frontend Task CRUD and State Management

## Overview
This guide provides essential information to get started with the implemented task CRUD functionality and state management.

## Prerequisites
- Next.js 14+ environment
- Existing better-auth authentication system configured
- Backend API endpoints for tasks available
- Existing API client at `/frontend/lib/api.ts`

## Setup

### 1. Task Page Configuration
The task management is handled in the `/frontend/app/tasks/page.tsx`:

```typescript
// This page is protected by the middleware and requires authentication
// Tasks are loaded when the page mounts using the useTaskManager hook
```

### 2. API Client Usage
The enhanced API client includes task-specific methods:

```typescript
// Example usage in components/pages
import { api } from '@/lib/api';

// Get tasks
const tasks = await api.get('/api/tasks');

// Create task
const newTask = await api.post('/api/tasks', { title: 'New Task', description: 'Task description' });

// Update task
const updatedTask = await api.put('/api/tasks/1', { title: 'Updated Task' });

// Delete task
await api.delete('/api/tasks/1');

// Toggle completion
await api.patch('/api/tasks/1/complete', { completed: true });
```

## Key Features

### Task State Management
- Local state management using React hooks (useState, useReducer)
- Optimistic updates with rollback on failure
- Loading states for each operation
- Error handling with user feedback

### Authentication Integration
- Automatic user identification from Better Auth session
- No manual user ID handling required
- Protected routes enforced by middleware

### UI Components
- TaskList component for displaying tasks
- TaskItem component for individual task interactions
- TaskForm component for creating/updating tasks
- Loading and Empty state components

## Integration Points

### Adding New Task Operations
To add additional task operations:
1. Extend the TaskOperation type in types
2. Add new API methods to the API client
3. Update the useTaskManager hook to handle the new operation

### Custom Error Handling
Override default error handling by catching exceptions from the API client:
```typescript
try {
  const data = await api.post('/api/tasks', taskData);
  // Handle success
} catch (error) {
  // Custom error handling
  console.error('Task creation failed:', error);
}
```

## Testing
- Verify tasks load correctly on `/tasks` page for authenticated users
- Test create, update, delete, and toggle completion operations
- Verify optimistic updates and rollback on API failures
- Confirm error states display appropriately
- Validate loading indicators appear during operations

## Troubleshooting
- If tasks don't load: Check authentication status and API connectivity
- If operations fail: Verify API endpoints and request formatting
- If state is inconsistent: Check for race conditions in optimistic updates
- If UI doesn't update: Verify state management implementation