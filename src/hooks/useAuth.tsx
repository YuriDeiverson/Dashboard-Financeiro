/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../utils/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem("user");
    }
  }, []);

  const login = async (email: string, _pass: string): Promise<void> => {
    // Mock login logic
    // mark _pass as used for lint
    void _pass;
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = { id: "1", name: "Usuário Demo", email: email };
        localStorage.setItem("user", JSON.stringify(mockUser));
        setUser(mockUser);
        resolve();
      }, 500);
    });
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("filters"); // Also clear filters on logout
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
