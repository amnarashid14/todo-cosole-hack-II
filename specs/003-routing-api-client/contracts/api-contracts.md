# API Contracts: Frontend Routing and API Client Integration

## Overview
This document defines the API contracts for the centralized API client that handles authentication and communication with backend services.

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

## API Methods

### GET Request
**Method**: `api.get(url, options?)`

**Parameters**:
- `url`: string - API endpoint URL
- `options?`: object - Optional request options

**Returns**: Promise containing response data

**Example**:
```typescript
const tasks = await api.get('/api/tasks');
// Returns: { success: true, data: [...], status: 200 }
```

### POST Request
**Method**: `api.post(url, data, options?)`

**Parameters**:
- `url`: string - API endpoint URL
- `data`: any - Request payload
- `options?`: object - Optional request options

**Returns**: Promise containing response data

**Example**:
```typescript
const newTask = await api.post('/api/tasks', { title: 'New Task' });
// Returns: { success: true, data: { id: 1, title: 'New Task' }, status: 201 }
```

### PUT Request
**Method**: `api.put(url, data, options?)`

**Parameters**:
- `url`: string - API endpoint URL
- `data`: any - Request payload
- `options?`: object - Optional request options

**Returns**: Promise containing response data

**Example**:
```typescript
const updatedTask = await api.put('/api/tasks/1', { title: 'Updated Task' });
// Returns: { success: true, data: { id: 1, title: 'Updated Task' }, status: 200 }
```

### DELETE Request
**Method**: `api.delete(url, options?)`

**Parameters**:
- `url`: string - API endpoint URL
- `options?`: object - Optional request options

**Returns**: Promise containing response status

**Example**:
```typescript
const result = await api.delete('/api/tasks/1');
// Returns: { success: true, status: 200 }
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

### Other Error Statuses
For non-401 errors:
1. Returns error response with appropriate status
2. Does not redirect user
3. Displays error message to user interface

**Response**:
```json
{
  "success": false,
  "error": "Error description",
  "status": 400 // or other error status
}
```

## Request/Response Examples

### Successful Task Creation
**Request**:
```
POST /api/tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 123,
    "title": "New Task",
    "description": "Task description",
    "completed": false
  },
  "status": 201
}
```

### Unauthorized Request
**Request**:
```
GET /api/tasks
Authorization: Bearer invalid-token
```

**Response**:
```json
{
  "success": false,
  "error": "Unauthorized: Session expired",
  "status": 401
}
```

## Integration Contract

### Frontend Components
All frontend components must use the API client at `/frontend/lib/api.ts` for backend communication.

### Backend API Compatibility
The API client is compatible with existing backend API endpoints. No backend changes are required.

### Authentication Integration
The API client integrates with the existing better-auth authentication system and retrieves JWT tokens automatically.