import { getAuthToken, clearAuthToken } from './auth-manager';
import { ApiResponse, ApiRequestConfig, ApiErrorResponse, ApiSuccessResponse, RequestOptions } from '../types/api';

/**
 * Centralized API client for all backend communication
 * Automatically handles JWT token inclusion and error handling
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Makes a request to the API via proxy
   * @param config API request configuration
   * @returns Promise with API response
   */
  private async makeRequest<T>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    try {
      // Use proxy to communicate with backend API
      const proxyUrl = '/api/proxy';

      // Get the auth token
      const token = getAuthToken();

      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...config.headers,
      };

      // Add authorization header if token exists
      // The getAuthToken() function now only retrieves from localStorage
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Prepare request options for proxy
      const requestOptions: RequestInit = {
        method: 'POST',
        headers,
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify({
          path: config.url, // Original API path
          method: config.method, // Original method
          body: config.body, // Original body
        }),
      };

      // Make the fetch request to proxy
      const response = await fetch(proxyUrl, requestOptions);

      // Parse response
      let data;
      try {
        data = await response.json();
      } catch (error) {
        // If response is not JSON, return text
        data = await response.text();
      }

      // Handle 401 Unauthorized responses
      if (response.status === 401) {
        // Clear the auth token to prevent further requests with invalid token
        if (typeof window !== 'undefined') {
          clearAuthToken();
        }

        return {
          success: false,
          error: 'Unauthorized: Session expired',
          status: 401,
        } as ApiErrorResponse;
      }

      // Return success response
      if (response.ok) {
        return {
          success: true,
          data,
          status: response.status,
        } as ApiSuccessResponse<T>;
      } else {
        // Return error response for other statuses
        return {
          success: false,
          error: typeof data === 'string' ? data : (data.message || `Request failed with status ${response.status}`),
          status: response.status,
        } as ApiErrorResponse;
      }
    } catch (error: any) {
      // Handle network errors
      return {
        success: false,
        error: error.message || 'Network error occurred',
        status: 0,
      } as ApiErrorResponse;
    }
  }

  /**
   * Makes a GET request to the API
   * @param url API endpoint URL
   * @param options Optional request options
   * @returns Promise with API response
   */
  async get<T = any>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const config: ApiRequestConfig = {
      url,
      method: 'GET',
      headers: options?.headers,
    };

    return this.makeRequest<T>(config);
  }

  /**
   * Makes a POST request to the API
   * @param url API endpoint URL
   * @param body Request body
   * @param options Optional request options
   * @returns Promise with API response
   */
  async post<T = any>(url: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    const config: ApiRequestConfig = {
      url,
      method: 'POST',
      headers: options?.headers,
      body,
    };

    return this.makeRequest<T>(config);
  }

  /**
   * Makes a PUT request to the API
   * @param url API endpoint URL
   * @param body Request body
   * @param options Optional request options
   * @returns Promise with API response
   */
  async put<T = any>(url: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    const config: ApiRequestConfig = {
      url,
      method: 'PUT',
      headers: options?.headers,
      body,
    };

    return this.makeRequest<T>(config);
  }

  /**
   * Makes a DELETE request to the API
   * @param url API endpoint URL
   * @param options Optional request options
   * @returns Promise with API response
   */
  async delete<T = any>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const config: ApiRequestConfig = {
      url,
      method: 'DELETE',
      headers: options?.headers,
    };

    return this.makeRequest<T>(config);
  }

  /**
   * Makes a PATCH request to the API
   * @param url API endpoint URL
   * @param body Request body
   * @param options Optional request options
   * @returns Promise with API response
   */
  async patch<T = any>(url: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    const config: ApiRequestConfig = {
      url,
      method: 'PATCH',
      headers: options?.headers,
      body,
    };

    return this.makeRequest<T>(config);
  }
}

// Create and export a singleton instance of the API client
// Use NEXT_PUBLIC_API_BASE_URL from environment variables, fallback to empty string (same origin)
const API_BASE_URL = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_API_BASE_URL || '')
  : (process.env.API_BASE_URL || '');

export const api = new ApiClient(API_BASE_URL);

// Export the ApiClient class for potential extension
export { ApiClient };

/**
 * Task-specific API methods
 */
export const taskApi = {
  /**
   * Get all tasks for the authenticated user
   * @returns Promise with array of tasks
   */
  getTasks: async () => {
    return api.get('/api/v1/tasks');
  },

  /**
   * Create a new task
   * @param taskData Task data including title and optional description
   * @returns Promise with created task
   */
  createTask: async (taskData: { title: string; description?: string }) => {
    return api.post('/api/v1/tasks', taskData);
  },

  /**
   * Update an existing task
   * @param taskId ID of the task to update
   * @param taskData Updated task data
   * @returns Promise with updated task
   */
  updateTask: async (taskId: string, taskData: { title?: string; description?: string; completed?: boolean }) => {
    return api.put(`/api/v1/tasks/${taskId}`, taskData);
  },

  /**
   * Delete a task
   * @param taskId ID of the task to delete
   * @returns Promise with deletion status
   */
  deleteTask: async (taskId: string) => {
    return api.delete(`/api/v1/tasks/${taskId}`);
  },

  /**
   * Toggle task completion status
   * @param taskId ID of the task to toggle
   * @param completed New completion status
   * @returns Promise with updated task
   */
  toggleTaskCompletion: async (taskId: string, completed: boolean) => {
    return api.patch(`/api/v1/tasks/${taskId}/complete`, { completed });
  }
};