# Quickstart Guide: Frontend Routing and API Client Integration

## Overview
This guide provides essential information to get started with the implemented routing protection and API client features.

## Prerequisites
- Node.js 18+ installed
- Next.js 14+ environment
- Existing better-auth authentication system configured
- Backend API endpoints available

## Setup

### 1. Middleware Configuration
The route protection is handled in `middleware.ts` at the project root:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Route protection logic implemented here
  // Public routes: '/', '/login', '/register'
  // Protected routes: '/tasks'
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

### 2. API Client Usage
The centralized API client is located at `/frontend/lib/api.ts`:

```typescript
// Example usage in components/pages
import { api } from '@/lib/api';

// GET request
const data = await api.get('/api/tasks');

// POST request
const result = await api.post('/api/tasks', { title: 'New Task' });

// PUT request
const updated = await api.put('/api/tasks/1', { title: 'Updated Task' });

// DELETE request
const deleted = await api.delete('/api/tasks/1');
```

## Key Features

### Route Protection
- Public routes (`/`, `/login`, `/register`) are accessible to all users
- Protected routes (`/tasks`) require authentication
- Unauthenticated users accessing protected routes are redirected to `/login`
- Authenticated users accessing auth pages (`/login`, `/register`) are redirected to `/tasks`

### Automatic Authentication
- The API client automatically attaches `Authorization: Bearer <token>` header
- Token is retrieved from existing better-auth session
- No manual token management required

### Error Handling
- 401 Unauthorized responses automatically redirect to `/login`
- Other API errors display user-friendly messages
- Network errors are handled gracefully

## Integration Points

### Adding New Protected Routes
To protect additional routes:
1. Add the route path to the middleware protection rules
2. Ensure the API client is used for all backend communications

### Custom Error Handling
Override default error handling by catching exceptions from the API client:
```typescript
try {
  const data = await api.get('/api/tasks');
  // Handle success
} catch (error) {
  // Custom error handling
  console.error('API call failed:', error);
}
```

## Testing
- Verify public routes are accessible without authentication
- Verify protected routes redirect unauthenticated users to login
- Test API calls include proper authorization headers
- Confirm 401 responses redirect to login page
- Validate other error responses show appropriate messages

## Troubleshooting
- If routes are not protected: Check middleware.ts configuration
- If API calls lack auth headers: Verify better-auth session is active
- If 401s don't redirect: Check API client error handling implementation