"use client";

import { decodeJwt } from "@/utils/decodeJwt";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";


type User = {
  id: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  name?: string;
} | null;

type AuthContextType = {
  user: User;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeJwt(token);
      setUser(decoded as User);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decoded = decodeJwt(token);
    setUser(decoded as User);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}