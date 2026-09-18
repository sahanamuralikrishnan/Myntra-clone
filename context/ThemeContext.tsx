import React, { createContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { themes } from "../config/themes";
import axios from "axios";
import { useAuth } from "./AuthContext";

interface ThemeContextType {
  theme: typeof themes.light; // type inferred from themes.js
  setTheme: (themeName: keyof typeof themes) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [themeName, setThemeName] = useState<keyof typeof themes>("light");
  const [theme, setTheme] = useState(themes[themeName]);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("theme");
      const systemTheme = Appearance.getColorScheme() || "light";
      const finalTheme = (savedTheme as keyof typeof themes) || systemTheme;
      setThemeName(finalTheme);
      setTheme(themes[finalTheme]);
    };
    loadTheme();
  }, []);

  // ✅ When a user logs in, apply whatever theme is saved on their account
  useEffect(() => {
    if (user?.theme && themes[user.theme as keyof typeof themes]) {
      const serverTheme = user.theme as keyof typeof themes;
      setThemeName(serverTheme);
      setTheme(themes[serverTheme]);
      AsyncStorage.setItem("theme", serverTheme);
    }
  }, [user]);

  const changeTheme = async (newTheme: keyof typeof themes) => {
    setThemeName(newTheme);
    setTheme(themes[newTheme]);
    await AsyncStorage.setItem("theme", newTheme);

    if (user?._id) {
      try {
        await axios.put(`http://192.168.18.27:5000/user/${user._id}/theme`, {
          theme: newTheme,
        });
      } catch (error) {
        console.error("Error syncing theme:", error);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
