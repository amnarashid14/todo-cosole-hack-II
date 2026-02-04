/**
 * Utility functions for authentication token management
 * Uses JWT tokens stored only in localStorage (single source of truth)
 */

/**
 * Retrieves the authentication token from browser storage
 * @returns The JWT token string or null if not found
 */
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    // Client-side: Get token from localStorage only (single source of truth)
    return localStorage.getItem('access_token');
  } else {
    // Server-side: This would need to be handled differently in server components
    // For now, return null - server-side auth would use different mechanism
    return null;
  }
}

/**
 * Checks if the user is authenticated by verifying the presence of a token
 * @returns Boolean indicating if user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  return token !== null && token.length > 0;
}

/**
 * Removes the authentication token (logout functionality)
 */
export function clearAuthToken(): void {
  if (typeof window !== 'undefined') {
    // Clear token from localStorage only
    localStorage.removeItem('access_token');
    // Remove any auth-related cookies to ensure complete cleanup
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict';
    document.cookie = 'better-auth.session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict';
  }
}