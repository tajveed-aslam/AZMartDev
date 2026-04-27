"use client";
import { create } from "zustand";
import api from "@/lib/api";
import { getToken, setToken, clearToken } from "@/lib/auth";
import type { User } from "@/types";

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  initialized: boolean; // true once fetchMe() has settled (success or failure)
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, fullName: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: getToken(),
  isLoading: false,
  // If there is no token we're already initialized (nothing to fetch)
  initialized: !getToken(),

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setToken(data.access_token);
      set({ user: data.user, token: data.access_token, initialized: true });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email, fullName, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post("/auth/register", {
        email,
        full_name: fullName,
        password,
      });
      setToken(data.access_token);
      set({ user: data.user, token: data.access_token, initialized: true });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    clearToken();
    set({ user: null, token: null, initialized: true });
  },

  fetchMe: async () => {
    const token = getToken();
    if (!token) {
      set({ initialized: true });
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      set({ user: data, token, initialized: true });
    } catch {
      clearToken();
      set({ user: null, token: null, initialized: true });
    }
  },
}));
