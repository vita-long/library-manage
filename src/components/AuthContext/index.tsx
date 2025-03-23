import React, { createContext, useContext, useState } from 'react';
import { tokenManager } from '@/utils/token';
import { userManager } from '@/utils/user';

export type User = {
  id: string;
  username: string;
  email: string;
};

type AuthContextType = {
  isAuth: boolean;
  user: User | null;
  login: (token: string, userData?: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<{
    isAuth: boolean;
    user: User | null;
  }>(() => {
    const token = tokenManager.getToken();
    const user = userManager.getUser();
    return { isAuth: !!token, user };
  });

  const login = (token: string, userData?: User) => {
    tokenManager.setToken(token);
    if (userData) {
      userManager.setUser(userData);
    }
    setAuthState({ isAuth: true, user: userData || null });
  };

  const logout = () => {
    tokenManager.clearToken();
    userManager.clearUser();
    setAuthState({ isAuth: false, user: null });
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);