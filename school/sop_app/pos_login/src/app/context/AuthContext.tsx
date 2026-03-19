import React, { createContext, useContext, useState } from "react";

export type Role = "admin" | "manager" | "cashier";

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: Role) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USERS: Record<string, User & { password: string }> = {
  admin: {
    id: "u1",
    username: "admin",
    password: "admin123",
    name: "Alice Johnson",
    role: "admin",
    avatar: "AJ",
  },
  manager: {
    id: "u2",
    username: "manager",
    password: "manager123",
    name: "Bob Smith",
    role: "manager",
    avatar: "BS",
  },
  cashier: {
    id: "u3",
    username: "cashier",
    password: "cashier123",
    name: "Carol Davis",
    role: "cashier",
    avatar: "CD",
  },
  cashier2: {
    id: "u4",
    username: "cashier2",
    password: "cashier123",
    name: "David Lee",
    role: "cashier",
    avatar: "DL",
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string, role: Role): boolean => {
    const found = Object.values(DEMO_USERS).find(
      (u) => u.username === username && u.password === password && u.role === role
    );
    if (found) {
      const { password: _, ...userWithoutPassword } = found;
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
