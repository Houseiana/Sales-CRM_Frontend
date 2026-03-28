"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { authApi, type CrmUser } from "./api";

interface AuthContextValue {
  user: CrmUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManageTeam: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CrmUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("crm_user");
    const token = localStorage.getItem("crm_token");
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("crm_user");
        localStorage.removeItem("crm_token");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    localStorage.setItem("crm_token", res.token);
    localStorage.setItem("crm_user", JSON.stringify(res.user));
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("crm_token");
    localStorage.removeItem("crm_user");
    setUser(null);
    window.location.href = "/login";
  }, []);

  const role = user?.role || "";
  const isAdmin = role === "Admin";
  const canEdit = ["Admin", "Sales Manager", "Sales Agent", "Business Development"].includes(role);
  const canDelete = ["Admin", "Sales Manager"].includes(role);
  const canManageTeam = isAdmin;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, canEdit, canDelete, canManageTeam }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
