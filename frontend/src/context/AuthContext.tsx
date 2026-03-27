import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { User, AuthContextType } from '@/types';
import { apiUrl } from '@/lib/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar si hay sesión guardada
    const savedUser = localStorage.getItem('gmh_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role === 'admin' ? 'admin' : 'cliente',
        };
        setUser(user);
        localStorage.setItem('gmh_user', JSON.stringify(user));
        return { success: true };
      }
      return { success: false, error: data.error || 'No se pudo iniciar sesión' };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(apiUrl('/api/auth/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre: name, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // El registro solo envía código, no crea usuario aún
        return { success: true };
      }
      return { success: false, error: data.error || 'Error desconocido' };
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }, []);

  const verifyCode = useCallback(async (email: string, code: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(apiUrl('/api/auth/verify-code'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (data.success && data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role === 'admin' ? 'admin' : 'cliente',
        };
        setUser(user);
        localStorage.setItem('gmh_user', JSON.stringify(user));
        return { success: true };
      }
      return { success: false, error: data.message || 'Código inválido' };
    } catch (error) {
      console.error('Error en verificación:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('gmh_user');
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    user,
    isAuthenticated: !!user,
    login,
    register,
    verifyCode,
    logout
  }), [user, login, register, verifyCode, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
