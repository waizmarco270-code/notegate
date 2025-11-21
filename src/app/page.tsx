"use client";

import { useState, useEffect, useRef } from "react";
import { MainLayout } from "@/components/main-layout";
import { SettingsDialog } from "@/components/settings-dialog";
import { LoadingScreen } from "@/components/loading-screen";
import { WelcomeDialog } from "@/components/welcome-dialog";
import { useLocalStorage } from "@/hooks/use-local-storage";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [hasVisited, setHasVisited] = useLocalStorage("hasVisited", false);
  const [isWelcomeOpen, setWelcomeOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Run the 3-second timer
    timerRef.current = setTimeout(() => {
      setLoading(false);
      if (!hasVisited) {
        setWelcomeOpen(true);
      }
    }, 3000);

    // Cleanup the timer if the component unmounts
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [hasVisited, setHasVisited]);

  const handleWelcomeClose = () => {
    setWelcomeOpen(false);
    setHasVisited(true);
  };
  
  const handleSkipAnimation = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setLoading(false);
    if (!hasVisited) {
      setWelcomeOpen(true);
    }
  };

  if (loading) {
    return <LoadingScreen onSkip={handleSkipAnimation} />;
  }

  return (
    <>
      <MainLayout />
      <SettingsDialog />
      <WelcomeDialog open={isWelcomeOpen} onOpenChange={handleWelcomeClose} />
    </>
  );
}
