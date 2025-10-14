"use client";

import { ThemeProvider } from "@/context/theme-provider";
import { NotesProvider } from "@/context/notes-provider";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <NotesProvider>
        {children}
        <Toaster />
      </NotesProvider>
    </ThemeProvider>
  );
}
