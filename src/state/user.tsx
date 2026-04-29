import { createContext, useContext, useEffect, useState } from "react";
import { register, login, updatePassword } from "../services/authService";
import type { LoginRequest, RegisterRequest, UpdatePasswordRequest } from "../services/authService";

export type UserAccount = {
  fullName: string;
  email: string;
};

interface UserContextType {
  account: UserAccount | null;
  token: string | null;
  isAuthenticated: boolean;
  createAccount: (payload: RegisterRequest) => Promise<boolean>;
  signIn: (payload: LoginRequest) => Promise<boolean>;
  signOut: () => void;
  updatePassword: (payload: UpdatePasswordRequest) => Promise<boolean>;
}

const TOKEN_STORAGE_KEY = "auth-token";
const UserContext = createContext<UserContextType | null>(null);

function loadStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function decodeAccountFromToken(token: string): UserAccount | null {
  try {
    const payloadPart = token.split(".")[1] || "";
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "===".slice((base64.length + 3) % 4);
    const payload = JSON.parse(atob(padded));
    return {
      fullName: payload.fullName || payload.name || payload.sub || "",
      email: payload.email || payload.sub || "",
    };
  } catch {
    return null;
  }
}

function storeToken(token: string | null) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => loadStoredToken());
  const [account, setAccount] = useState<UserAccount | null>(() => {
    const stored = loadStoredToken();
    return stored ? decodeAccountFromToken(stored) : null;
  });

  // Decode token to get account info
  useEffect(() => {
    if (token) {
      const decoded = decodeAccountFromToken(token);
      setAccount(decoded);
      if (!decoded) {
        setToken(null);
      }
    } else {
      setAccount(null);
    }
  }, [token]);

  // Persist token
  useEffect(() => {
    storeToken(token);
  }, [token]);

  const createAccount = async ({ fullName, email, password }: RegisterRequest) => {
    try {
      await register({ fullName, email, password });
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const signIn = async ({ email, password }: LoginRequest) => {
    try {
      const response = await login({ email, password });
      setToken(response.token);
      setAccount(response.account);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const signOut = () => {
    setToken(null);
    setAccount(null);
  };

  const handleUpdatePassword = async (payload: UpdatePasswordRequest) => {
    if (!token) {
      throw new Error("Not authenticated");
    }
    try {
      await updatePassword(payload, token);
      return true;
    } catch (error) {
      console.error('Password update failed:', error);
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{
        account,
        token,
        isAuthenticated: !!token,
        createAccount,
        signIn,
        signOut,
        updatePassword: handleUpdatePassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within UserProvider");
  }
  return ctx;
}
