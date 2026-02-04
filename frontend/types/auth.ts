// User interface representing a user in the system
export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  createdAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

// Session interface representing an active user session
export interface Session {
  sessionId: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  isPersistent: boolean;
  lastAccessedAt: Date;
}

// Registration data interface for creating new users
export interface RegistrationData {
  name: string;
  email: string;
  username: string;
  password: string;
}

// Login credentials interface
export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
  rememberMe?: boolean;
}

// Password reset request interface
export interface PasswordResetRequest {
  email: string;
}

// Password reset data interface
export interface PasswordResetData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Response interfaces
export interface AuthResponse<T = User> {
  success: boolean;
  user?: T;
  session?: Session;
  error?: {
    message: string;
    code?: string;
  };
}

export interface PasswordResetResponse {
  success: boolean;
  message?: string;
  error?: {
    message: string;
    code?: string;
  };
}

// Form validation errors interface
export interface FormErrors {
  [key: string]: string;
}

// Validation rules interface
export interface ValidationRules {
  email: RegExp;
  password: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  username: {
    minLength: number;
    maxLength: number;
    pattern: RegExp;
  };
}