/**
 * Centralized authentication manager following the target architecture
 * JWT is the single source of truth, stored only in localStorage
 * Better Auth is used only for UI session helpers, not token storage
 */

// Constants for token storage
const TOKEN_KEY = 'access_token';

/**
 * Retrieves the JWT authentication token from localStorage only
 * @returns The JWT token string or null if not found
 */
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

/**
 * Stores the JWT authentication token in localStorage only
 * @param token The JWT token to store
 */
export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

/**
 * Checks if the user is authenticated by verifying the presence and validity of a JWT token
 * @returns Boolean indicating if user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  return token !== null && token.length > 0 && isTokenValid();
}

/**
 * Removes the authentication token (logout functionality)
 * Clears only the localStorage token as per target architecture
 */
export function clearAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);

    // Also clear the cookie for consistency with middleware
    document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
  }
}

/**
 * Validates if the JWT token is still valid (not expired)
 * @returns Boolean indicating if token is valid
 */
export function isTokenValid(): boolean {
  const token = getAuthToken();
  if (!token) {
    return false;
  }

  try {
    // Decode JWT token to check expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch (error) {
    // If token is malformed, consider it invalid
    return false;
  }
}

/**
 * Gets the user ID from the JWT token
 * @returns User ID from token or null if not available
 */
export function getUserIdFromToken(): string | null {
  const token = getAuthToken();
  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id || payload.sub || null;
  } catch (error) {
    return null;
  }
}