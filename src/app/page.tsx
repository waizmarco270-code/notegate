"use client";

import { MainLayout } from "@/components/main-layout";
import { SettingsDialog } from "@/components/settings-dialog";

export default function Home() {
  return (
    <>
      <MainLayout />
      <SettingsDialog />
    </>
  );
}
