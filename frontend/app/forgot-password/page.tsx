'use client';

import { useState } from 'react';
import PasswordResetRequestForm from '../../components/auth/PasswordResetRequestForm';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSuccess = (msg: string) => {
    setMessage({ type: 'success', text: msg });
  };

  const handleError = (msg: string) => {
    setMessage({ type: 'error', text: msg });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {message ? (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {message.type === 'success' ? 'Check Your Email' : 'Error'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 mb-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
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
      ) : (
        <PasswordResetRequestForm
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}
    </div>
  );
}