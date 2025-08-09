import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  created_at: string;
};

type Auth = {
  token: string | null;
  user: User | null;
  setToken: (t: string | null) => void;
  setUser: (u: User | null) => void;
};

const Ctx = createContext<Auth>({
  token: null,
  user: null,
  setToken: () => {},
  setUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Load token + user from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Sync token to localStorage
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // Sync user to localStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  return (
    <Ctx.Provider value={{ token, user, setToken, setUser }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);