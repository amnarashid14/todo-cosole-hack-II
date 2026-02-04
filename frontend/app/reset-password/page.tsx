'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isTokenValid, setIsTokenValid] = useState(true); // Simplified for demo

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    // In a real implementation, this would validate the token
    // For now, we'll assume the token is valid
    if (!token) {
      setIsTokenValid(false);
      setErrorMessage('Missing reset token. Please request a new password reset.');
    } else {
      // Here you would typically validate the token with your backend
      // For this demo, we'll assume it's valid
      setIsTokenValid(true);
    }
  }, [token]);

  const validatePassword = (password: string) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
      return 'Password must contain uppercase, lowercase, number and special character';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    setErrors({});

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrors({ password: passwordError });
      setLoading(false);
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      // Call Better Auth's password reset API
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: password
        }),
      });

      if (response.ok) {
        setSuccessMessage('Your password has been reset successfully. You can now log in with your new password.');

        // Reset form
        setPassword('');
        setConfirmPassword('');
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setErrorMessage('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Invalid Reset Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {errorMessage}
            </div>
            <div className="text-center">
              <a
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Back to Login
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Reset Your Password</CardTitle>
        </CardHeader>
        <CardContent>
          {successMessage ? (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {successMessage}
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="New Password"
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    // Clear error when user starts typing
                    if (errors.password) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.password;
                        return newErrors;
                      });
                    }
                  }}
                  error={errors.password}
                  placeholder="Enter new password"
                  required
                />

                <Input
                  label="Confirm New Password"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    // Clear error when user starts typing
                    if (errors.confirmPassword) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.confirmPassword;
                        return newErrors;
                      });
                    }
                  }}
                  error={errors.confirmPassword}
                  placeholder="Confirm new password"
                  required
                />

                <Button
                  type="submit"
                  className="w-full"
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}