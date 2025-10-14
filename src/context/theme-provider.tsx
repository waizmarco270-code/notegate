"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

type Theme = "default" | "ocean" | "forest" | "rose";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  setDarkMode: (isDark: boolean) => void;
  openSettings: boolean;
  setOpenSettings: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>("theme", "default");
  const [isDarkMode, setDarkMode] = useLocalStorage<boolean>("dark-mode", true);
  const [openSettings, setOpenSettings] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (isMounted) {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      if (isDarkMode) {
        root.classList.add("dark");
      } else {
        root.classList.add("light");
      }
      
      root.classList.forEach(className => {
        if (className.startsWith('theme-')) {
          root.classList.remove(className);
        }
      });
      
      root.classList.add(`theme-${theme}`);
    }
  }, [theme, isDarkMode, isMounted]);
  

  const value: ThemeContextType = {
    theme,
    setTheme,
    isDarkMode,
    setDarkMode: (isDark) => setDarkMode(isDark),
    openSettings,
    setOpenSettings
  };
  
  if (!isMounted) {
    return null;
  }

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
