# API Client Usage Guide

## Overview
The centralized API client handles all backend communication with automatic JWT token inclusion and error handling.

## Import
```typescript
import { api } from '@/lib/api';
```

## Available Methods

### GET Requests
```typescript
const response = await api.get('/api/tasks');
if (response.success) {
  const tasks = response.data;
} else {
  console.error('Error:', response.error);
}
```

### POST Requests
```typescript
const response = await api.post('/api/tasks', { title: 'New Task', description: 'Task description' });
if (response.success) {
  const newTask = response.data;
} else {
  console.error('Error:', response.error);
}
```

### PUT Requests
```typescript
const response = await api.put('/api/tasks/1', { title: 'Updated Task' });
if (response.success) {
  const updatedTask = response.data;
} else {
  console.error('Error:', response.error);
}
```

### DELETE Requests
```typescript
const response = await api.delete('/api/tasks/1');
if (response.success) {
  console.log('Task deleted successfully');
} else {
  console.error('Error:', response.error);
}
```

## Error Handling
- 401 Unauthorized responses automatically redirect to `/login`
- Other error responses include an `error` property with the error message
- Network errors return `status: 0` with a generic network error message

## Authentication
- JWT tokens are automatically retrieved from cookies and included in the `Authorization: Bearer <token>` header
- No manual token management is required when using the API client