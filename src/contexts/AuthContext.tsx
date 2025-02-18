
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  signup: (email: string, password: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email: string, password: string) => {
    // Simulated authentication
    if (email && password) {
      setIsAuthenticated(true);
      toast.success('Successfully logged in');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    toast.success('Successfully logged out');
  };

  const signup = (email: string, password: string) => {
    // Simulated signup
    if (email && password) {
      setIsAuthenticated(true);
      toast.success('Account created successfully');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
