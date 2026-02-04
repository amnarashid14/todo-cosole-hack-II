'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../../lib/auth-manager';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const [authorized, setAuthorized] = useState<boolean | null>(null); // null = loading
  const router = useRouter();

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount

    // Synchronous check using cookies instead of API call
    const checkAuthStatus = () => {
      if (!isMounted) return;

      if (isAuthenticated()) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        // Use replace instead of push to prevent back button issues
        router.replace('/login');
      }
    };

    // Add a small delay to ensure cookie is properly set before checking
    const timer = setTimeout(() => {
      if (isMounted) {
        checkAuthStatus();
      }
    }, 100); // Small delay to allow cookie propagation

    // Cleanup function to set isMounted to false when component unmounts
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []); // Remove router from dependency array to prevent infinite loop

  // Show fallback while checking auth status
  if (authorized === null) {
    return fallback || (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // If not authorized, we're redirecting in the useEffect, but return null for safety
  if (authorized === false) {
    return null; // Don't render children if definitely not authorized
  }

  // If still checking authorization status, show loading
  if (authorized === null) {
    return fallback || (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Only render children if authorized
  return <>{children}</>;
}