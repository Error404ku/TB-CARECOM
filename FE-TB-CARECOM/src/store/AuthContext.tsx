// store/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

type User = {
  role: 'admin' | 'user' | 'pmo' | 'perawat';
  name: string;
  email?: string;
  id?: number;
};

type AuthContextType = {
  user: User | null;
  authLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Initialize user from localStorage on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token && role) {
      try {
        // Decode JWT to get user info
        const decoded: any = jwtDecode(token);
        setUser({
          role: decoded.role || role,
          name: decoded.name || 'User',
          email: decoded.email,
          id: decoded.id
        });
      } catch (decodeError) {
        console.error('Error decoding token:', decodeError);
        // If token structure is invalid, clean up localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
      }
    }
    
    // Mark auth loading as complete
    setAuthLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
