"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

type Theme = "light" | "dark";
export type FontTheme = "default" | "modern" | "elegant";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontTheme: FontTheme;
  setFontTheme: (fontTheme: FontTheme) => void;
  openSettings: boolean;
  setOpenSettings: (open: boolean) => void;
  isDarkMode: boolean;
  setDarkMode: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>("theme", "light");
  const [fontTheme, setFontTheme] = useLocalStorage<FontTheme>("fontTheme", "default");
  const [openSettings, setOpenSettings] = useState(false);

  useEffect(() => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("font-theme-default", "font-theme-modern", "font-theme-elegant");
    root.classList.add(`font-theme-${fontTheme}`);
  }, [fontTheme]);
  
  const isDarkMode = theme === 'dark';
  const setDarkMode = (isDark: boolean) => {
    setTheme(isDark ? 'dark' : 'light');
  }

  const value: ThemeContextType = {
    theme,
    setTheme,
    fontTheme,
    setFontTheme,
    openSettings,
    setOpenSettings,
    isDarkMode,
    setDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
