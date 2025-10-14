"use client";

import { MainLayout } from "@/components/main-layout";
import { SettingsDialog } from "@/components/settings-dialog";
import { NotesProvider } from "@/context/notes-provider";

export default function Home() {
  return (
    <NotesProvider>
      <MainLayout />
      <SettingsDialog />
    </NotesProvider>
  );
}
