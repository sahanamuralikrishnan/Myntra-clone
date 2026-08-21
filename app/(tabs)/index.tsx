import React from "react";
import { ThemeProvider, ThemeContext } from "@/context/ThemeContext";
import Navigator from "../navigator";
import { BagProvider } from "../contexts/BagContext";

export default function App() {
  return (
    <ThemeProvider>
      <Navigator />
    </ThemeProvider>
  );
  
}