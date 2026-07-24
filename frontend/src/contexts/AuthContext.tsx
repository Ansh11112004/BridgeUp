import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, getToken, setToken, clearToken, getErrorMessage } from "@/lib/api";
import { disconnectSocket } from "@/lib/socket";

export type Role = "organizer" | "sponsor";
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  org?: string; // college or business name
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: Role;
  org?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<AuthUser>;
  register: (input: RegisterInput) => Promise<AuthUser>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  loading: true,
  login: async () => {
    throw new Error("AuthProvider not mounted");
  },
  register: async () => {
    throw new Error("AuthProvider not mounted");
  },
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, if a token exists, validate it against the API and restore the session
  useEffect(() => {
    const restore = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch {
        clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const login = async ({ email, password }: LoginInput) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setToken(data.token);
      setUser(data.user);
      return data.user as AuthUser;
    } catch (err) {
      throw new Error(getErrorMessage(err, "Login failed"));
    }
  };

  const register = async (input: RegisterInput) => {
    try {
      const { data } = await api.post("/auth/register", input);
      setToken(data.token);
      setUser(data.user);
      return data.user as AuthUser;
    } catch (err) {
      throw new Error(getErrorMessage(err, "Registration failed"));
    }
  };

  const logout = () => {
    setUser(null);
    clearToken();
    disconnectSocket();
  };

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout }}>{children}</Ctx.Provider>
  );
};

export const useAuth = () => useContext(Ctx);

export const dashboardPath = (role: Role) =>
  role === "organizer" ? "/organizer/dashboard" : "/sponsor/dashboard";
