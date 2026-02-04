/**
 * Error display utility for API error messages
 */

import React from 'react';

export interface ErrorDisplayProps {
  error: string | null;
  onClose?: () => void;
}

/**
 * Renders an error message in a styled container
 * @param error The error message to display
 * @param onClose Optional callback for closing the error display
 * @returns JSX element for displaying the error
 */
export function ErrorDisplay({ error, onClose }: ErrorDisplayProps): JSX.Element | null {
  if (!error) {
    return null;
  }

  return (
    <div className="rounded-md bg-red-50 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{error}</h3>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-2 -my-2">
              <button
                type="button"
                className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                onClick={onClose}
              >
                <span className="sr-only">Dismiss</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Formats an error message for display
 * @param error The raw error to format
 * @returns Formatted error message string
 */
export function formatErrorMessage(error: any): string {
  if (!error) {
    return '';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  if (error.error) {
    return typeof error.error === 'string' ? error.error : JSON.stringify(error.error);
  }

  if (typeof error === 'object') {
    return JSON.stringify(error);
  }

  return 'An unknown error occurred';
}

/**
 * Logs an error to the console with additional context
 * @param error The error to log
 * @param context Optional context information
 */
export function logError(error: any, context?: string): void {
  console.group(`Error${context ? ` (${context})` : ''}`);
  console.error(error);
  console.groupEnd();
}