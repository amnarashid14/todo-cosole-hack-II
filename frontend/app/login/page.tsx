'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '../../lib/auth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const router = useRouter();

  // Real-time validation for email/username format
  const validateEmailUsername = (value: string) => {
    if (!value) {
      return 'Email or username is required';
    }

    // Check if it looks like an email (contains @)
    if (value.includes('@')) {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Invalid email format';
      }
    } else {
      // Username validation - assuming usernames can contain letters, numbers, underscores, hyphens
      const usernameRegex = /^[a-zA-Z0-9_-]+$/;
      if (!usernameRegex.test(value)) {
        return 'Invalid username format';
      }
    }

    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real-time validation
    if (name === 'email') {
      const error = validateEmailUsername(value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (loading || hasRedirected) {
      return;
    }

    setLoading(true);
    setGeneralError('');

    // Validate form before submission
    const emailError = validateEmailUsername(formData.email);
    if (emailError) {
      setErrors({ email: emailError });
      setLoading(false);
      return;
    }

    if (!formData.password) {
      setErrors({ password: 'Password is required' });
      setLoading(false);
      return;
    }

    try {
      const result = await signIn('email-password', {
        email: formData.email,
        password: formData.password,
        options: {
          rememberMe,
        },
      });

      if (!result?.error) {
        // Set the cookie explicitly
        if (result.access_token) {
          document.cookie = `access_token=${result.access_token}; path=/; SameSite=Strict`;
        }

        // Mark that we've redirected to prevent multiple attempts
        setHasRedirected(true);

        // Small delay to ensure cookie is properly set before redirecting
        setTimeout(() => {
          router.push('/tasks');
        }, 200);
      } else {
        setGeneralError(result.error.message);
      }
    } catch (err) {
      setGeneralError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          {generalError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md" role="alert">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email or Username"
              id="email"
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email or username"
              required
            />

            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, password: e.target.value }));
                // Clear password error when user starts typing
                if (errors.password) {
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.password;
                    return newErrors;
                  });
                }
              }}
              error={errors.password}
              placeholder="••••••••"
              required
            />

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Forgot your password?{' '}
            <a href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
              Reset it
            </a>
          </div>

          <div className="mt-2 text-center text-sm">
            Don't have an account?{' '}
            <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}