# Data Model: Frontend Routing and API Client Integration

## Overview
This document defines the data structures and entities for the frontend routing protection and API client integration feature.

## Key Entities

### 1. Authentication Token
**Description**: Represents the user's authenticated session state
**Attributes**:
- token: string (JWT token string)
- expiry: Date (expiration timestamp)
- userId: string (associated user identifier)
- createdAt: Date (token creation time)

**Validation Rules**:
- Token must be in valid JWT format
- Expiry must be in the future
- Token must be properly signed and verifiable

### 2. API Request Configuration
**Description**: Configuration object for API requests made through the client
**Attributes**:
- url: string (endpoint URL)
- method: "GET" | "POST" | "PUT" | "DELETE" (HTTP method)
- headers: Record<string, string> (request headers)
- body?: any (request body for POST/PUT)
- token?: string (optional authentication token override)

### 3. API Response Object
**Description**: Structure of API responses returned by the client
**Attributes**:
- success: boolean (whether request succeeded)
- data?: any (response data on success)
- error?: string (error message on failure)
- status: number (HTTP status code)
- message?: string (optional response message)

### 4. Route Protection Rule
**Description**: Defines which routes are public vs protected and redirect behavior
**Attributes**:
- path: string (route path pattern)
- isProtected: boolean (whether authentication is required)
- redirectPath: string (where to redirect if access denied)
- allowedRoles: string[] (roles allowed to access, default: all authenticated users)

## State Transitions

### Authentication State
- **UNAUTHENTICATED** → **AUTHENTICATING** (when login initiated)
- **AUTHENTICATING** → **AUTHENTICATED** (on successful login)
- **AUTHENTICATING** → **UNAUTHENTICATED** (on login failure)
- **AUTHENTICATED** → **UNAUTHENTICATED** (on logout/expiry)

### API Request State
- **IDLE** → **LOADING** (when request initiated)
- **LOADING** → **SUCCESS** (on successful response)
- **LOADING** → **ERROR** (on error response)
- **LOADING** → **UNAUTHORIZED** (on 401 response)

## Relationships
- Route Protection Rule is associated with multiple paths
- Authentication Token is used by API Request Configuration
- API Response Object is returned by API Request

## Constraints
- Authentication tokens must be securely stored and transmitted
- API requests must include proper authorization headers when authenticated
- Route protection rules must be consistently applied across the application