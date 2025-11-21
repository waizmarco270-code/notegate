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
  // Always start with loading true to prevent rendering MainLayout prematurely
  const [loading, setLoading] = useState(true);
  const [hasVisited, setHasVisited] = useLocalStorage("hasVisited", false);
  const [isWelcomeOpen, setWelcomeOpen] = useState(false);

  useEffect(() => {
    // Decide what to do based on the animation setting
    if (isAnimationEnabled) {
      // If enabled, run the 3-second timer
      const timer = setTimeout(() => {
        setLoading(false);
        if (!hasVisited) {
          setWelcomeOpen(true);
        }
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      // If disabled, stop loading immediately and show welcome if needed
      setLoading(false);
      if (!hasVisited) {
        setWelcomeOpen(true);
      }
    }
  }, [isAnimationEnabled, hasVisited, setHasVisited]);

  const handleWelcomeClose = () => {
    setWelcomeOpen(false);
    setHasVisited(true);
  };

  // Conditionally render based on the loading state
  if (loading && isAnimationEnabled) {
    return <LoadingScreen />;
  }
  
  if (loading && !isAnimationEnabled) {
    // When animation is disabled, we are in a loading state for a very short time.
    // Render nothing during this flicker-preventing moment.
    return null; 
  }

  return (
    <>
      <MainLayout />
      <SettingsDialog />
      <WelcomeDialog open={isWelcomeOpen} onOpenChange={handleWelcomeClose} />
    </>
  );
}
