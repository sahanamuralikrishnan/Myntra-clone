import React from "react";
import { ThemeProvider, ThemeContext } from "@/app/context/ThemeContext";
import Navigator from "../navigator";


export default function App() {
  return (
    <ThemeProvider>
      
      <Navigator />
    
    </ThemeProvider>
  );
  
}