import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { IUser, LoginFormData, RegisterFormData } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: IUser | null;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: IUser; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, isLoading: false, user: action.payload.user, error: null };
    case 'AUTH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (credentials: LoginFormData) => Promise<void>;
  register: (userData: RegisterFormData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: authService.getStoredUser(),
    isLoading: false,
    error: null,
  });

  const login = async (credentials: LoginFormData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const authData = await authService.login(credentials);
      authService.saveAuthData(authData);
      dispatch({ type: 'AUTH_SUCCESS', payload: authData });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.response?.data?.message || 'Ошибка входа' });
      throw error;
    }
  };

  const register = async (userData: RegisterFormData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const authData = await authService.register(userData);
      authService.saveAuthData(authData);
      dispatch({ type: 'AUTH_SUCCESS', payload: authData });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.response?.data?.message || 'Ошибка регистрации' });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, clearError }}>
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
