# API Contracts: Task Management

## Overview
This document defines the API contracts for task management operations that the frontend will use.

## Base API Client Interface

### Authentication Headers
All requests made through the API client automatically include:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Response Format
All responses follow this standard format:

#### Success Response
```json
{
  "success": true,
  "data": { /* response payload */ },
  "status": 200
}
```

#### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "status": 400
}
```

## Task API Methods

### GET Tasks Request
**Method**: `api.get('/api/tasks')`

**Parameters**: None

**Returns**: Promise containing array of task objects

**Example**:
```typescript
const tasks = await api.get('/api/tasks');
// Returns: { success: true, data: [{ id: "1", title: "Task 1", completed: false, ... }], status: 200 }
```

**Success Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string (optional)",
      "completed": "boolean",
      "createdAt": "ISO date string",
      "updatedAt": "ISO date string"
    }
  ],
  "status": 200
}
```

### POST Create Task Request
**Method**: `api.post('/api/tasks', taskData)`

**Parameters**:
- `taskData`: object containing task information
  - `title`: string (required)
  - `description?`: string (optional)

**Returns**: Promise containing created task object

**Example**:
```typescript
const newTask = await api.post('/api/tasks', { title: 'New Task', description: 'Task description' });
// Returns: { success: true, data: { id: "2", title: "New Task", completed: false, ... }, status: 201 }
```

**Success Response**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "description": "string (optional)",
    "completed": "boolean",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  },
  "status": 201
}
```

### PUT Update Task Request
**Method**: `api.put('/api/tasks/{taskId}', taskData)`

**Parameters**:
- `taskId`: string (task identifier)
- `taskData`: object containing updated task information
  - `title?`: string (optional)
  - `description?`: string (optional)
  - `completed?`: boolean (optional)

**Returns**: Promise containing updated task object

**Example**:
```typescript
const updatedTask = await api.put('/api/tasks/1', { title: 'Updated Task', completed: true });
// Returns: { success: true, data: { id: "1", title: "Updated Task", completed: true, ... }, status: 200 }
```

**Success Response**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "description": "string (optional)",
    "completed": "boolean",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  },
  "status": 200
}
```

### PATCH Toggle Task Completion Request
**Method**: `api.patch('/api/tasks/{taskId}/complete', completionData)`

**Parameters**:
- `taskId`: string (task identifier)
- `completionData`: object containing completion status
  - `completed`: boolean (new completion status)

**Returns**: Promise containing updated task object

**Example**:
```typescript
const updatedTask = await api.patch('/api/tasks/1/complete', { completed: true });
// Returns: { success: true, data: { id: "1", title: "Task 1", completed: true, ... }, status: 200 }
```

**Success Response**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "description": "string (optional)",
    "completed": "boolean",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  },
  "status": 200
}
```

### DELETE Task Request
**Method**: `api.delete('/api/tasks/{taskId}')`

**Parameters**:
- `taskId`: string (task identifier)

**Returns**: Promise containing success status

**Example**:
```typescript
const result = await api.delete('/api/tasks/1');
// Returns: { success: true, status: 200 }
```

**Success Response**:
```json
{
  "success": true,
  "status": 200
}
```

## Error Handling Contract

### 401 Unauthorized
When the API returns a 401 status:
1. The client automatically redirects to `/login`
2. Returns error response with status 401
3. Clears any local authentication state

**Response**:
```json
{
  "success": false,
  "error": "Unauthorized: Session expired",
  "status": 401
}
```

### 422 Validation Error
When the API returns a 422 status for invalid input:
1. Returns error response with validation details
2. Does not redirect user
3. Displays field-specific error messages

**Response**:
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "title": "Title is required"
  },
  "status": 422
}
```

### Other Error Statuses
For non-401, non-422 errors:
1. Returns error response with appropriate status
2. Does not redirect user
3. Displays generic error message to user interface

**Response**:
```json
{
  "success": false,
  "error": "Error description",
  "status": 400 // or other error status
}
```

## Integration Contract

### Frontend Components
All frontend components must use the API client at `/frontend/lib/api.ts` for task backend communication.

### Backend API Compatibility
The API client is compatible with existing backend API endpoints for tasks.

### Authentication Integration
The API client integrates with the existing better-auth authentication system and retrieves JWT tokens automatically to identify the requesting user.