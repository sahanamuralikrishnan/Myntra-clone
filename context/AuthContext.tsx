
import { getuserdata, saveuserdata, clearuserdata } from "../utils/storage";
import { createContext, useEffect, useState, useContext } from "react";
import React from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    (async () => {
      const data = await getuserdata();
      if (data.name && data.email) {
        setUser({ name: data.name, email: data.email });
        setIsAuthenticated(true);
      }
    })();
  }, []);

  const signup = async (fullName: string, email: string, password: string) => {
    const res = await fetch("http://192.168.18.27:5000/user/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    });
    const data = await res.json();
    if (data.user) {
      await saveuserdata(data.user.fullname, data.user.email);
      setUser({ name: data.user.fullname, email: data.user.email });
      setIsAuthenticated(true);
    } else {
      throw new Error(data.message || "signup failed");
    }
  };

  const login = async (email: string, password: string) => {
    const res = await fetch("http://192.168.18.27:5000/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.user) {
      await saveuserdata(data.user.fullname, data.user.email);
      setUser({ name: data.user.fullname, email: data.user.email });
      setIsAuthenticated(true);
    } else {
      throw new Error(data.message || "Login failed");
    }
  };

  const logout = async () => {
    await clearuserdata();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;

