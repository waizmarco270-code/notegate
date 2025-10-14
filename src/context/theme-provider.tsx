"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  openSettings: boolean;
  setOpenSettings: (open: boolean) => void;
  isDarkMode: boolean;
  setDarkMode: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>("theme", "light");
  const [openSettings, setOpenSettings] = useState(false);

  useEffect(() => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(theme);
  }, [theme]);
  
  const isDarkMode = theme === 'dark';
  const setDarkMode = (isDark: boolean) => {
    setTheme(isDark ? 'dark' : 'light');
  }


  const value: ThemeContextType = {
    theme,
    setTheme,
    openSettings,
    setOpenSettings,
    isDarkMode,
    setDarkMode
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
