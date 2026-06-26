import { create } from "zustand";

const STORAGE_KEY = "learnup.auth";

interface StoredAuth {
  token: string;
  expiresAt: string;
}

interface AuthState {
  token: string | null;
  expiresAt: string | null;
  isAuthenticated: () => boolean;
  setAuth: (token: string, expiresAt: string) => void;
  clearAuth: () => void;
}

function isExpired (expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  const time = new Date(expiresAt).getTime();
  if (Number.isNaN(time)) return false;
  return time <= Date.now();
}

function loadStoredAuth (): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredAuth;
    if (!parsed?.token) return null;
    return parsed;
  } catch {
    return null;
  }
}

const initial = loadStoredAuth();

export const useAuthStore = create<AuthState>((set, get) => ({
  token: initial?.token ?? null,
  expiresAt: initial?.expiresAt ?? null,
  isAuthenticated: () => {
    const { token, expiresAt } = get();
    return !!token && !isExpired(expiresAt);
  },
  setAuth: (token, expiresAt) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, expiresAt }));
    set({ token, expiresAt });
  },
  clearAuth: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ token: null, expiresAt: null });
  },
}));

/**
 * Non-reactive token accessor for the API layer (OpenAPI TOKEN resolver).
 * Returns undefined when there is no token or it has expired.
 */
export function getAuthToken (): string | undefined {
  const { token, expiresAt } = useAuthStore.getState();
  if (!token || isExpired(expiresAt)) return undefined;
  return token;
}

export function clearAuth (): void {
  useAuthStore.getState().clearAuth();
}
