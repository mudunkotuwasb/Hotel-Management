import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'receptionist' | 'housekeeping' | 'kitchen' | 'customer';
  avatar?: string;
  phone?: string;
  preferences?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'customer';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('hotel_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication - in real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data based on email
    let mockUser: User;
    
    if (email === 'admin@hotel.com') {
      mockUser = {
        id: '1',
        name: 'Admin User',
        email: 'admin@hotel.com',
        role: 'admin',
        phone: '+1-555-0123'
      };
    } else if (email === 'receptionist@hotel.com') {
      mockUser = {
        id: '2',
        name: 'Sarah Johnson',
        email: 'receptionist@hotel.com',
        role: 'receptionist',
        phone: '+1-555-0456'
      };
    } else if (email === 'customer@example.com') {
      mockUser = {
        id: '3',
        name: 'John Customer',
        email: 'customer@example.com',
        role: 'customer',
        phone: '+1-555-0789',
        preferences: ['Non-smoking', 'High floor']
      };
    } else {
      setIsLoading(false);
      return false;
    }

    setUser(mockUser);
    localStorage.setItem('hotel_user', JSON.stringify(mockUser));
    setIsLoading(false);
    
    // Redirect to appropriate dashboard after successful login
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
    
    return true;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock registration - in real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role || 'customer',
      phone: userData.phone,
      preferences: []
    };

    setUser(newUser);
    localStorage.setItem('hotel_user', JSON.stringify(newUser));
    setIsLoading(false);
    
    // Redirect to customer dashboard after successful registration
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hotel_user');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
