'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface LocaleContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'welcome': 'Welcome',
    'login': 'Login',
    'register': 'Register',
    'logout': 'Logout',
    'email': 'Email',
    'password': 'Password',
    'confirmPassword': 'Confirm Password',
    'username': 'Username',
    'name': 'Name',
    'rememberMe': 'Remember me',
    'forgotPassword': 'Forgot Password?',
    'resetPassword': 'Reset Password',
    'sendResetLink': 'Send Reset Link',
    'newPassword': 'New Password',
    'confirmNewPassword': 'Confirm New Password',
    'resetPasswordSuccess': 'Password reset successfully',
    'loginSuccess': 'Login successful',
    'registerSuccess': 'Registration successful',
    'invalidEmail': 'Please enter a valid email',
    'passwordTooWeak': 'Password is too weak',
    'passwordMismatch': 'Passwords do not match',
    'requiredField': 'This field is required',
    'emailExists': 'Email already exists',
    'usernameExists': 'Username already exists',
    'invalidCredentials': 'Invalid credentials',
    'sessionExpired': 'Session expired, please login again',
  },
  es: {
    'welcome': 'Bienvenido',
    'login': 'Iniciar sesión',
    'register': 'Registrarse',
    'logout': 'Cerrar sesión',
    'email': 'Correo electrónico',
    'password': 'Contraseña',
    'confirmPassword': 'Confirmar contraseña',
    'username': 'Nombre de usuario',
    'name': 'Nombre',
    'rememberMe': 'Recuérdame',
    'forgotPassword': '¿Olvidaste tu contraseña?',
    'resetPassword': 'Restablecer contraseña',
    'sendResetLink': 'Enviar enlace de restablecimiento',
    'newPassword': 'Nueva contraseña',
    'confirmNewPassword': 'Confirmar nueva contraseña',
    'resetPasswordSuccess': 'Contraseña restablecida con éxito',
    'loginSuccess': 'Inicio de sesión exitoso',
    'registerSuccess': 'Registro exitoso',
    'invalidEmail': 'Por favor ingrese un correo electrónico válido',
    'passwordTooWeak': 'La contraseña es demasiado débil',
    'passwordMismatch': 'Las contraseñas no coinciden',
    'requiredField': 'Este campo es obligatorio',
    'emailExists': 'El correo electrónico ya existe',
    'usernameExists': 'El nombre de usuario ya existe',
    'invalidCredentials': 'Credenciales inválidas',
    'sessionExpired': 'Sesión expirada, por favor inicie sesión nuevamente',
  }
};

const defaultLocale = typeof window !== 'undefined'
  ? navigator.language.split('-')[0]
  : 'en';

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState(defaultLocale);

  useEffect(() => {
    // Load saved locale preference
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && savedLocale in translations) {
      setLocale(savedLocale);
    }
  }, []);

  const t = (key: string): string => {
    const currentTranslations = translations[locale as keyof typeof translations];
    return currentTranslations?.[key] || key;
  };

  const value = {
    locale,
    setLocale: (newLocale: string) => {
      setLocale(newLocale);
      localStorage.setItem('locale', newLocale);
    },
    t
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}