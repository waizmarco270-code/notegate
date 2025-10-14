"use client";

import { ThemeProvider } from "@/context/theme-provider";
import { NotesProvider } from "@/context/notes-provider";
import { Toaster } from "@/components/ui/toaster";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <NotesProvider>
        {children}
        <Toaster />
        <PwaInstallPrompt />
      </NotesProvider>
    </ThemeProvider>
  );
}
