# Research: Frontend Routing and API Client Integration

## Overview
This document captures research findings for implementing frontend routing protection and API client integration in the Next.js application.

## Decisions Made

### 1. Middleware Strategy for Authentication Detection
**Decision**: Use Next.js middleware with better-auth session verification
**Rationale**: Next.js middleware runs before page rendering and can intercept requests to check authentication state. Better-auth provides session verification utilities that can be used in middleware.
**Implementation**: Check for session cookie or JWT token in middleware and redirect accordingly.

### 2. Redirect Handling Logic
**Decision**: Implement redirect logic in middleware.ts with path-based rules
**Rationale**: Middleware is the standard way to handle authentication redirects in Next.js App Router
**Edge Cases Handled**: Direct URL access, browser refresh, deep linking

### 3. API Client Design
**Decision**: Create a fetch wrapper in `/frontend/lib/api.ts` that automatically injects JWT
**Rationale**: A centralized fetch wrapper ensures all API calls go through the same authentication mechanism and error handling
**Pattern**: Wrapper function that adds Authorization header and handles 401 responses

### 4. JWT Retrieval Method
**Decision**: Extract JWT from browser cookies or session storage using better-auth client utilities
**Rationale**: Better-auth manages session state, so we should leverage its built-in mechanisms rather than storing tokens separately
**Alternative Considered**: Custom token storage but rejected to maintain consistency with existing auth system

### 5. Error Handling Approach
**Decision**: Centralized error handling in the API client
**Rationale**: Having error handling in one place (the API client) makes it easier to manage and maintain
**Implementation**: Check response status in fetch wrapper and redirect on 401, show messages for other errors

## Technical Details Resolved

### Next.js Middleware Implementation
- Location: `middleware.ts` in project root
- Uses `next-auth` or better-auth session verification
- Matches paths using `matcher` configuration
- Handles redirects using NextResponse.redirect()

### API Client Implementation
- Location: `/frontend/lib/api.ts`
- Exports functions for common HTTP methods (GET, POST, PUT, DELETE)
- Automatically attaches `Authorization: Bearer <token>` header
- Handles 401 redirects to `/login`
- Shows user-friendly error messages for other errors

### Route Protection Rules
- Public routes: `/`, `/login`, `/register` - accessible to all users
- Protected routes: `/tasks` - requires authentication
- Authenticated users accessing `/login` or `/register` are redirected to `/tasks`

## Alternatives Considered

### For Middleware Strategy:
- Component-level HOC (Higher Order Component) - rejected because middleware runs earlier and is more efficient
- Client-side redirects - rejected because server-side protection is more secure

### For API Client Design:
- Direct fetch calls with manual token insertion - rejected due to duplication and maintenance
- Third-party libraries like axios - rejected to keep dependencies minimal
- GraphQL instead of REST - not applicable since backend API remains unchanged

### For Error Handling:
- Per-component error handling - rejected due to inconsistency
- Global error boundary - not suitable for API call errors