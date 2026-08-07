import React from "react";
import { ThemeProvider, ThemeContext } from "@/context/ThemeContext";
import Navigator from "../navigator";

export default function App() {
  return (
    <ThemeProvider>
      <Navigator />
    </ThemeProvider>
  );
}