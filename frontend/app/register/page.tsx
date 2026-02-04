'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '../../lib/auth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { RegistrationData } from '../../types/auth';

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    email: '',
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateField = (name: string, value: string) => {
    let error = '';

    switch (name) {
      case 'email':
        if (!value) {
          error = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Email is invalid';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value)) {
          error = 'Password must contain uppercase, lowercase, number and special character';
        }
        break;
      case 'username':
        if (!value) {
          error = 'Username is required';
        } else if (value.length < 3 || value.length > 30) {
          error = 'Username must be between 3 and 30 characters';
        } else if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
          error = 'Username can only contain letters, numbers, underscores, and hyphens';
        }
        break;
      case 'name':
        if (!value) {
          error = 'Name is required';
        } else if (value.length < 1 || value.length > 100) {
          error = 'Name must be between 1 and 100 characters';
        }
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real-time validation
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value as string);
      if (error) {
        newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const result = await signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        username: formData.username
      });

      if (!result?.error) {
        // Store the access token if returned from backend
        if (result.access_token) {
          localStorage.setItem('access_token', result.access_token);
          // Also set in cookie for broader compatibility
          document.cookie = `access_token=${result.access_token}; path=/;`;
        }

        router.push('/tasks');
        router.refresh();
      } else {
        // Handle specific error messages
        if (result.error.detail && typeof result.error.detail === 'string') {
          if (result.error.detail.toLowerCase().includes('email')) {
            setErrors({ email: 'Email already exists' });
          } else if (result.error.detail.toLowerCase().includes('username')) {
            setErrors({ username: 'Username already exists' });
          } else {
            setErrors({ general: result.error.detail });
          }
        } else if (result.error.message) {
          setErrors({ general: result.error.message });
        } else {
          setErrors({ general: 'Registration failed. Please try again.' });
        }
      }
    } catch (err: any) {
      setErrors({ general: 'An unexpected error occurred' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md" role="alert">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="John Doe"
              required
            />

            <Input
              label="Email"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="john@example.com"
              required
            />

            <Input
              label="Username"
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              placeholder="johndoe"
              required
            />

            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}