"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/main-layout";
import { SettingsDialog } from "@/components/settings-dialog";
import { LoadingScreen } from "@/components/loading-screen";
import { WelcomeDialog } from "@/components/welcome-dialog";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useTheme } from "@/context/theme-provider";

export default function Home() {
  const { isAnimationEnabled } = useTheme();
  const [loading, setLoading] = useState(isAnimationEnabled);
  const [hasVisited, setHasVisited] = useLocalStorage("hasVisited", false);
  const [isWelcomeOpen, setWelcomeOpen] = useState(false);

  useEffect(() => {
    if (isAnimationEnabled) {
      const timer = setTimeout(() => {
        setLoading(false);
        if (!hasVisited) {
          setWelcomeOpen(true);
        }
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
      if (!hasVisited) {
        setWelcomeOpen(true);
      }
    }
  }, [hasVisited, isAnimationEnabled]);

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
