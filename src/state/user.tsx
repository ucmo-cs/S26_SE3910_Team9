import { createContext, useContext, useEffect, useState } from "react";

export type StoredUserAccount = {
  fullName: string;
  email: string;
  passwordHash: string;
};

export type UserAccount = {
  fullName: string;
  email: string;
};

interface UserContextType {
  account: UserAccount | null;
  hasRegisteredAccount: boolean;
  registeredEmail: string | null;
  isAuthenticated: boolean;
  createAccount: (payload: { fullName: string; email: string; password: string }) => Promise<boolean>;
  signIn: (payload: { email: string; password: string }) => Promise<boolean>;
  signOut: () => void;
  clearAccount: () => void;
}

const USER_STORAGE_KEY = "commerce-bank-user";
const UserContext = createContext<UserContextType | null>(null);

async function hashPassword(password: string) {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function loadStoredUser(): StoredUserAccount | null {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (parsed && typeof parsed === "object" && typeof parsed.fullName === "string" && typeof parsed.email === "string") {
      return {
        fullName: parsed.fullName,
        email: parsed.email,
        passwordHash: typeof parsed.passwordHash === "string" ? parsed.passwordHash : "",
      };
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [storedAccount, setStoredAccount] = useState<StoredUserAccount | null>(() => loadStoredUser());
  const [sessionAccount, setSessionAccount] = useState<UserAccount | null>(null);

  useEffect(() => {
    if (storedAccount) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(storedAccount));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [storedAccount]);

  const createAccount = async ({ fullName, email, password }: { fullName: string; email: string; password: string }) => {
    if (password.length < 8) return false;
    const normalizedEmail = email.trim().toLowerCase();

    if (storedAccount && storedAccount.email === normalizedEmail) {
      return false;
    }

    const passwordHash = await hashPassword(password);
    const normalizedAccount = {
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash,
    };
    setStoredAccount(normalizedAccount);
    setSessionAccount({ fullName: normalizedAccount.fullName, email: normalizedAccount.email });
    return true;
  };

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    if (!storedAccount) return false;

    const normalizedEmail = email.trim().toLowerCase();
    if (storedAccount.email !== normalizedEmail) return false;

    const passwordHash = await hashPassword(password);
    if (passwordHash !== storedAccount.passwordHash) return false;

    setSessionAccount({ fullName: storedAccount.fullName, email: storedAccount.email });
    return true;
  };

  const signOut = () => setSessionAccount(null);
  const clearAccount = () => {
    setSessionAccount(null);
    setStoredAccount(null);
  };

  const account = sessionAccount;
  const hasRegisteredAccount = Boolean(storedAccount);
  const registeredEmail = storedAccount?.email ?? null;
  const isAuthenticated = Boolean(sessionAccount);

  return (
    <UserContext.Provider
      value={{
        account,
        hasRegisteredAccount,
        registeredEmail,
        isAuthenticated,
        createAccount,
        signIn,
        signOut,
        clearAccount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return ctx;
}
