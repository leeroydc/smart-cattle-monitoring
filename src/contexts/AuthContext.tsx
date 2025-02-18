
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: 'Rancher' | 'Management';
  login: (email: string, password: string) => void;
  logout: () => void;
  signup: (email: string, password: string, role: 'Rancher' | 'Management') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'Rancher' | 'Management'>('Rancher');

  const showLoadingToast = () => {
    return toast.promise(
      new Promise((resolve) => setTimeout(resolve, 8000)),
      {
        loading: 'Processing...',
        success: 'Completed successfully',
        error: 'Something went wrong',
      }
    );
  };

  const login = (email: string, password: string) => {
    showLoadingToast();
    setTimeout(() => {
      setIsAuthenticated(true);
      toast.success('Successfully logged in');
    }, 8000);
  };

  const logout = () => {
    showLoadingToast();
    setTimeout(() => {
      setIsAuthenticated(false);
      toast.success('Successfully logged out');
    }, 8000);
  };

  const signup = (email: string, password: string, role: 'Rancher' | 'Management') => {
    showLoadingToast();
    setTimeout(() => {
      setIsAuthenticated(true);
      setUserRole(role);
      toast.success('Account created successfully');
    }, 8000);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout, signup }}>
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
