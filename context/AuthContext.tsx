import {
  getuserdata,
  saveuserdata,
  clearuserdata,
  saveauthtoken,
  getauthtoken,
  clearauthtoken,
} from "../utils/storage";
import { registerForPushNotificationsAsync } from "../utils/notifications";
import { API_URL } from "../utils/api";
import { createContext, useEffect, useState, useContext, useRef } from "react";
import React from "react";
import axios from "axios";

type AuthContextType = {
  isAuthenticated: boolean;
  user: { _id: string; name: string; email: string; theme?: string } | null;
  // Login token (JWT), sent as "Authorization: Bearer <token>" to protected routes
  token: string | null;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ _id: string; name: string; email: string; theme?: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const data = await getuserdata();
      const savedToken = await getauthtoken();
      if (data._id && data.name && data.email && savedToken) {
        setUser({ _id: data._id, name: data.name, email: data.email });
        setToken(savedToken);
        setIsAuthenticated(true);
      } else if (data._id) {
        // Logged in with an older app version that had no login token: log in again
        await clearuserdata();
      }
    })();
  }, []);

  // Remember this phone's push token so we can remove it on logout
  const pushTokenRef = useRef<string | null>(null);

  // When a user logs in, send this phone's push token to the backend
  useEffect(() => {
    if (!user?._id || !token) return;
    (async () => {
      try {
        const pushToken = await registerForPushNotificationsAsync();
        if (!pushToken) return;
        pushTokenRef.current = pushToken;
        await axios.post(
          `${API_URL}/push-token/register`,
          { token: pushToken },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Push token registered:", pushToken);
      } catch (error) {
        console.log("Push registration failed:", error);
      }
    })();
  }, [user?._id, token]);

  // Save everything we get back from login/signup
  const saveSession = async (u: any, newToken: string) => {
    await saveuserdata(u._id, u.fullname, u.email);
    await saveauthtoken(newToken);
    setUser({ _id: u._id, name: u.fullname, email: u.email, theme: u.theme });
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const signup = async (fullName: string, email: string, password: string) => {
    const res = await axios.post(`${API_URL}/user/signup`, {
      fullname: fullName,
      email,
      password,
    });
    const data = res.data;
    if (data.user && data.token) {
      await saveSession(data.user, data.token);
    } else {
      throw new Error(data.message || "signup failed");
    }
  };

  const login = async (email: string, password: string) => {
    const res = await axios.post(`${API_URL}/user/login`, {
      email,
      password,
    });
    const data = res.data;
    if (data.user && data.token) {
      await saveSession(data.user, data.token);
    } else {
      throw new Error(data.message || "Login failed");
    }
  };

  const logout = async () => {
    // Stop this phone from receiving the old user's notifications
    if (pushTokenRef.current && token) {
      try {
        await axios.post(
          `${API_URL}/push-token/unregister`,
          { token: pushTokenRef.current },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.log("Push unregister failed:", error);
      }
      pushTokenRef.current = null;
    }
    await clearuserdata();
    await clearauthtoken();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
