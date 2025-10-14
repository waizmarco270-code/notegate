"use client";

import { MainLayout } from "@/components/main-layout";
import { NotesProvider } from "@/context/notes-provider";

export default function Home() {
  return (
    <NotesProvider>
      <MainLayout />
    </NotesProvider>
  );
}
