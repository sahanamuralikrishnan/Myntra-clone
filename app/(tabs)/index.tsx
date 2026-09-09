import React from "react";
import { ThemeProvider, ThemeContext } from "@/context/ThemeContext";
// import Navigator from "../navigator";
import HomeScreen from "../Screens/HomeScreen";


export default function App() {
  return (
    <ThemeProvider>
      <HomeScreen />
    </ThemeProvider>
  );
  
}