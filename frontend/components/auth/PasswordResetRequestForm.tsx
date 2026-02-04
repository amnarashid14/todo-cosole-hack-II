'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

interface PasswordResetRequestFormProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export default function PasswordResetRequestForm({ onSuccess, onError }: PasswordResetRequestFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    if (!email) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Invalid email format';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      setLoading(false);
      return;
    }

    try {
      // In a real implementation, this would call the Better Auth password reset API
      // For now, we'll simulate the request
      console.log(`Password reset request for: ${email}`);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      onSuccess('Password reset link sent to your email. Please check your inbox.');
      setEmail('');
    } catch (error) {
      console.error('Password reset request error:', error);
      onError('Failed to send password reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-6 text-center">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              // Clear error when user starts typing
              if (errors.email) {
                setErrors(prev => {
                  const newErrors = { ...prev };
                  delete newErrors.email;
                  return newErrors;
                });
              }
            }}
            error={errors.email}
            placeholder="your@email.com"
            required
          />

          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}