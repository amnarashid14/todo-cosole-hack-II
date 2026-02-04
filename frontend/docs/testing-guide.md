# Testing Guide for Routing and API Client Integration

## Manual Testing Steps

### 1. Route Protection Tests

#### Test 1: Unauthenticated Access to Protected Route
1. Clear browser cookies/storage to ensure no active session
2. Navigate directly to `/tasks` in the browser
3. Verify that you are redirected to `/login`

#### Test 2: Authenticated Access to Protected Route
1. Log in to the application
2. Navigate to `/tasks`
3. Verify that you can access the page without being redirected

#### Test 3: Public Route Accessibility
1. Without logging in, navigate to `/`, `/login`, `/register`
2. Verify that these pages are accessible without redirects

#### Test 4: Authenticated Redirect from Login/Register
1. Log in to the application
2. Navigate to `/login` or `/register`
3. Verify that you are redirected to `/tasks`

### 2. API Client Tests

#### Test 5: Automatic JWT Token Inclusion
1. Log in to the application to establish a session
2. Use browser dev tools to inspect network requests
3. Make an API call using the client (e.g., `api.get('/api/tasks')`)
4. Verify that the `Authorization: Bearer <token>` header is included in the request

#### Test 6: 401 Redirect Behavior
1. Log in to the application
2. Manually clear the auth token from cookies/storage
3. Attempt an API call using the client
4. Verify that you are redirected to `/login`

#### Test 7: Non-401 Error Handling
1. Create a scenario where an API returns a 500 or 400 error
2. Make the API call using the client
3. Verify that the error is returned without redirect

### 3. Error Display Tests

#### Test 8: Error Message Display
1. Trigger an API error (e.g., invalid request)
2. Verify that the error message is displayed appropriately using the ErrorDisplay component

#### Test 9: Loading States
1. Make an API call
2. Verify that loading states are properly displayed during the request

## Automated Testing

For automated testing, you would typically use a framework like Jest with React Testing Library:

```typescript
// Example test structure
import { render, screen, waitFor } from '@testing-library/react';
import { api } from '../lib/api';

// Mock the auth utilities
jest.mock('../lib/auth-utils', () => ({
  getAuthToken: jest.fn(() => 'mock-token'),
}));

describe('API Client', () => {
  test('includes auth token in requests', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: 'test' }),
      } as Response)
    ) as jest.MockedFunction<typeof fetch>;

    await api.get('/api/test');

    expect(fetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer mock-token',
        }),
      })
    );
  });
});
```

## Expected Outcomes

- All route protection rules work as specified
- API calls automatically include JWT tokens when available
- 401 responses trigger redirect to login
- Non-401 errors are handled gracefully
- Loading and error states are properly displayed