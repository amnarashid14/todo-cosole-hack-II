'use client';

import { useState } from 'react';
import { signOut } from '../../lib/auth';
import { clearAuthToken } from '../../lib/auth-manager';
import { useRouter } from 'next/navigation';
import Button from '../../components/ui/Button';

interface LogoutButtonProps {
  children?: React.ReactNode;
  redirectPath?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export default function LogoutButton({
  children = 'Logout',
  redirectPath = '/login',
  variant = 'primary',
  size = 'md'
}: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);

    try {
      // Clear tokens immediately to prevent middleware redirect loops
      clearAuthToken();

      // Then notify backend about logout (fire and forget)
      signOut().catch(console.error);

      // Redirect to login page after clearing tokens
      router.push(redirectPath);
      // router.refresh(); // Commenting out refresh to avoid potential issues
    } catch (error) {
      console.error('Logout error:', error);
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant={variant}
      size={size}
      loading={loading}
      disabled={loading}
    >
      {loading ? 'Logging out...' : children}
    </Button>
  );
}