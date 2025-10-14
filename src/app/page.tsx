"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/main-layout";
import { SettingsDialog } from "@/components/settings-dialog";
import { LoadingScreen } from "@/components/loading-screen";
import { WelcomeDialog } from "@/components/welcome-dialog";
import { useLocalStorage } from "@/hooks/use-local-storage";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [hasVisited, setHasVisited] = useLocalStorage("hasVisited", false);
  const [isWelcomeOpen, setWelcomeOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (!hasVisited) {
        setWelcomeOpen(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [hasVisited]);

  const handleWelcomeClose = () => {
    setWelcomeOpen(false);
    setHasVisited(true);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <MainLayout />
      <SettingsDialog />
      <WelcomeDialog open={isWelcomeOpen} onOpenChange={handleWelcomeClose} />
    </>
  );
}
