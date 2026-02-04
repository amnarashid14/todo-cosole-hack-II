'use client';

import { useState } from 'react';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

interface PrivacyControlsProps {
  userId: string;
}

export default function PrivacyControls({ userId }: PrivacyControlsProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleDownloadData = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // In a real implementation, this would call an API to get user data
      // For demo purposes, we'll simulate the download
      setTimeout(() => {
        setMessage({
          type: 'success',
          text: 'Your data is being prepared for download. Check your email shortly.'
        });
      }, 1000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to prepare your data. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // In a real implementation, this would call an API to delete the user account
      // For demo purposes, we'll just show a message
      setTimeout(() => {
        setMessage({
          type: 'success',
          text: 'Your account deletion request has been submitted. You will receive an email confirmation.'
        });
      }, 1000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to submit account deletion request. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Privacy Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          Manage your privacy rights in accordance with GDPR and CCPA regulations.
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Data Access Rights</h3>
            <p className="text-sm text-gray-500 mb-3">
              Download a copy of your personal data stored in our system.
            </p>
            <Button
              onClick={handleDownloadData}
              variant="outline"
              loading={loading && message?.text?.includes('data')}
            >
              {loading && message?.text?.includes('data') ? 'Preparing...' : 'Download My Data'}
            </Button>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-medium mb-2">Right to Deletion</h3>
            <p className="text-sm text-gray-500 mb-3">
              Request deletion of your personal data and account.
            </p>
            <Button
              onClick={handleDeleteAccount}
              variant="outline"
              loading={loading && message?.text?.includes('deletion')}
              className="bg-red-50 text-red-700 hover:bg-red-100"
            >
              {loading && message?.text?.includes('deletion') ? 'Processing...' : 'Delete My Account'}
            </Button>
          </div>
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded-md ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}
      </CardContent>
    </Card>
  );
}