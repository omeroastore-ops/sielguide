import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { User } from "@/types/models";

const STORAGE_KEY = "sielguide.user";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setUser(JSON.parse(raw) as User);
      } catch {}
      setIsLoading(false);
    })();
  }, []);

  const persist = useCallback(async (u: User | null) => {
    if (u) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
    setUser(u);
  }, []);

  const login = useCallback(
    async (email: string, _password: string) => {
      const u: User = {
        id: Date.now().toString(),
        email: email.trim(),
        name: email.split("@")[0] ?? "Gast",
        created_at: new Date().toISOString(),
      };
      await persist(u);
    },
    [persist],
  );

  const register = useCallback(
    async (name: string, email: string, _password: string) => {
      const u: User = {
        id: Date.now().toString(),
        email: email.trim(),
        name: name.trim() || (email.split("@")[0] ?? "Gast"),
        created_at: new Date().toISOString(),
      };
      await persist(u);
    },
    [persist],
  );

  const logout = useCallback(async () => {
    await persist(null);
  }, [persist]);

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
