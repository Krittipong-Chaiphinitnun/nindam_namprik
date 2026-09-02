import React, { createContext, useContext, useState, ReactNode } from 'react';

const AUTH_API_URL = 'http://119.59.102.161:3006/api/auth';

export interface UserProfile {
  id?: number | string;
  username: string;
  role: 'user' | 'admin' | string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (username: string, password: string, role: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${AUTH_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (data.success && data.user) {
        setUser(data.user);
        setLoading(false);
        return { success: true, message: data.message || 'เข้าสู่ระบบสำเร็จ' };
      } else {
        setLoading(false);
        return { success: false, message: data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
      }
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
      };
    }
  };

  const register = async (username: string, password: string, role: string = 'customer') => {
    setLoading(true);
    try {
      const response = await fetch(`${AUTH_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password, role: role || 'customer' }),
      });

      const data = await response.json();
      setLoading(false);
      if (data.success) {
        return { success: true, message: data.message || 'ลงทะเบียนสำเร็จ' };
      } else {
        return { success: false, message: data.message || 'เกิดข้อผิดพลาดในการลงทะเบียน' };
      }
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
      };
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loading,
        login,
        register,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
