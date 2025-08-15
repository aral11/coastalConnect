/**
 * Fallback Auth Context - Provides default values for components using old AuthContext
 * This prevents crashes while we transition to the new SupabaseAuthContext
 */

import React, { createContext, useContext, ReactNode } from 'react';

// Define minimal auth interface for compatibility
interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, userData?: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Provide fallback values
  const value: AuthContextType = {
    user: null,
    isAuthenticated: false,
    loading: false,
    login: async () => {
      console.log('Login called - using fallback auth provider');
      // For demo purposes, just log
    },
    logout: async () => {
      console.log('Logout called - using fallback auth provider');
      // For demo purposes, just log
    },
    signup: async () => {
      console.log('Signup called - using fallback auth provider');
      // For demo purposes, just log
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
