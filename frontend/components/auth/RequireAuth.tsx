'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '../../lib/auth';

interface RequireAuthProps {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();

  useEffect(() => {
    async function checkAuthAndRedirect() {
      try {
        const session = await getSession();

        if (!session) {
          // Redirect to login if not authenticated
          router.push('/login');
          router.refresh();
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // Redirect to login on error as well
        router.push('/login');
        router.refresh();
      }
    }

    checkAuthAndRedirect();
  }, [router]);

  // This component doesn't render anything itself
  // It just checks auth and redirects if needed
  // The actual protected content should be handled by the page component
  return <>{children}</>;
}