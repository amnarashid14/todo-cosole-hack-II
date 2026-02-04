/**
 * Server-safe JWT utilities for validating tokens in middleware
 */

/**
 * Validates if the JWT token is still valid (not expired)
 * @param token The JWT token to validate
 * @returns Boolean indicating if token is valid
 */
export function isTokenValidOnServer(token: string): boolean {
  if (!token) {
    return false;
  }

  try {
    // Split the token to get the payload part
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if token is expired
    return payload.exp > currentTime;
  } catch (error) {
    // If token is malformed or any error occurs, consider it invalid
    return false;
  }
}