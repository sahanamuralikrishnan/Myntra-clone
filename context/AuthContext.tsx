
import { getuserdata, saveuserdata, clearuserdata } from "../utils/storage";
import { createContext, useEffect, useState, useContext } from "react";
import React from "react";
import axios from "axios";

type AuthContextType = {
  isAuthenticated: boolean;
    user: { _id: string; name: string; email: string; theme?: string } | null;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ _id: string; name: string; email: string; theme?: string } | null>(null);

  useEffect(() => {
    (async () => {
      const data = await getuserdata();
      if (data._id && data.name && data.email) {
        setUser({ _id: data._id, name: data.name, email: data.email });
        setIsAuthenticated(true);
      }
    })();
  }, []);

  const signup = async (fullName: string, email: string, password: string) => {
    const res = await axios.post("http://192.168.18.27:5000/user/signup", {
      fullName,
      email,
      password,
    });
    const data = await res.data.user;
    if (data.user) {
      await saveuserdata(data.user._id, data.user.fullName, data.user.email);
            setUser({ _id: data.user._id, name: data.user.fullName, email: data.user.email, theme: data.user.theme });

      setIsAuthenticated(true);
    } else {
      throw new Error(data.message || "signup failed");
    }
  };
    const login = async (email: string, password: string) => {
    const res = await axios.post("http://192.168.18.27:5000/user/login", {
      email,
      password,
    });
    const data = res.data;
    if (data.user) {
      await saveuserdata(data.user._id, data.user.fullname, data.user.email);
      setUser({ _id: data.user._id, name: data.user.fullname, email: data.user.email, theme: data.user.theme });
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

