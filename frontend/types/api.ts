/**
 * Type definitions for API responses and requests
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
  message?: string;
}

export interface ApiRequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  token?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  status: number;
  message?: string;
}

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  status: number;
  message?: string;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  body?: any;
}