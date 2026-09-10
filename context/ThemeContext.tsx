import React, { createContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { themes } from "../config/themes";
import react from "react";



interface ThemeContextType {
  theme: typeof themes.light; // type inferred from themes.js
  setTheme: (themeName: keyof typeof themes) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
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

  const changeTheme = async (newTheme: keyof typeof themes) => {
    setThemeName(newTheme);
    setTheme(themes[newTheme]);
    await AsyncStorage.setItem("theme", newTheme);
    // 🔗 Sync with backend here (API call)
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
