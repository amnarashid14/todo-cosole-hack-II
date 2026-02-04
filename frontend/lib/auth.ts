// For client-side authentication functions, we'll create helper functions
// that interact with the backend API endpoints through the proxy
import { setAuthToken, clearAuthToken } from './auth-manager';

// Helper function for signing in
export const signIn = async (provider: string, credentials: any) => {
  if (provider === 'email-password') {
    // Use the proxy route to communicate with backend auth
    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: '/api/v1/auth/login',
        method: 'POST',
        body: {
          email: credentials.email,
          password: credentials.password,
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data };
    }

    // Store token in localStorage only (single source of truth per target architecture)
    if (data.access_token) {
      setAuthToken(data.access_token);
    }

    return data;
  }

  // Handle other providers as needed
  throw new Error(`Provider ${provider} not supported`);
};

// Helper function for signing up
export const signUp = async (userData: any) => {
  // Use the proxy route to communicate with backend auth
  const response = await fetch('/api/proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      path: '/api/v1/auth/register',
      method: 'POST',
      body: {
        email: userData.email,
        username: userData.username,
        password: userData.password,
        password_confirm: userData.password, // Backend requires password confirmation
        name: userData.name // Backend might need name field
      }
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return { error: data };
  }

  // Store token in localStorage only (single source of truth per target architecture)
  if (data.access_token) {
    setAuthToken(data.access_token);
  }

  return data;
};

// Helper function for getting session
export const getSession = async () => {
  try {
    // Use the proxy route to communicate with backend auth
    const token = localStorage.getItem('access_token');

    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({
        path: '/api/v1/auth/me',
        method: 'GET',
      })
    });

    if (!response.ok) {
      // If the session is invalid/expired, clear the stored token
      clearAuthToken();
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting session:', error);
    // Clear the stored token on error
    clearAuthToken();
    return null;
  }
};

// Helper function for signing out
export const signOut = async () => {
  try {
    // Use the proxy route to communicate with backend auth
    // Send the JWT token in the Authorization header instead of relying on cookies
    const token = localStorage.getItem('access_token');

    await fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({
        path: '/api/v1/auth/logout',
        method: 'POST',
      })
    });
  } catch (error) {
    console.error('Error during logout:', error);
  }

  // Clear the stored token
  clearAuthToken();
  return true;
};