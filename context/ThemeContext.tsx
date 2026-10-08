import React, { createContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { themes } from "../config/themes";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { API_URL } from "@/utils/api";

interface ThemeContextType {
  theme: typeof themes.light; // type inferred from themes.js
  setTheme: (themeName: keyof typeof themes) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeName = keyof typeof themes;

// Only accept names we actually have a theme for (anything else would crash the screens)
const isThemeName = (name: unknown): name is ThemeName =>
  typeof name === "string" && name in themes;

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [themeName, setThemeName] = useState<ThemeName>("light");

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("theme");
      const systemTheme = Appearance.getColorScheme();
      if (isThemeName(savedTheme)) setThemeName(savedTheme);
      else if (isThemeName(systemTheme)) setThemeName(systemTheme);
    };
    loadTheme();
  }, []);

  // ✅ When a user logs in, apply whatever theme is saved on their account
  const serverTheme = user?.theme;
  useEffect(() => {
    if (isThemeName(serverTheme)) {
      AsyncStorage.setItem("theme", serverTheme);
    }
  }, [serverTheme]);
  const [appliedServerTheme, setAppliedServerTheme] = useState<string | undefined>();
  if (serverTheme !== appliedServerTheme) {
    setAppliedServerTheme(serverTheme);
    if (isThemeName(serverTheme)) setThemeName(serverTheme);
  }

  const theme = themes[themeName];

  const changeTheme = async (newTheme: ThemeName) => {
    setThemeName(newTheme);
    await AsyncStorage.setItem("theme", newTheme);

    if (user?._id) {
      try {
        await axios.put(`${API_URL}/user/${user._id}/theme`, {
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
