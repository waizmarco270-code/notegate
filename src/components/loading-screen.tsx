"use client";

import { useState, useEffect } from "react";
import { NotesGateLogo } from "./icons";
import { Progress } from "./ui/progress";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 28); // 3000ms / 100 = 30ms, slightly faster to finish just before 3s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="flex flex-col items-center justify-center space-y-6 content-fade-in">
        <NotesGateLogo className="w-24 h-24 text-primary" />
        <h1 className="text-4xl font-bold tracking-tighter">NotesGate</h1>
        <div className="w-64 space-y-2">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
             <div className="rainbow-loader-bar absolute h-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-center text-sm font-medium text-muted-foreground">
            Loading... {Math.round(progress)}%
          </p>
        </div>

        <div className="absolute bottom-10 text-center space-y-2">
           <p className="text-xs text-muted-foreground">Powered by EmityGate</p>
           <div className="dev-badge">
             <p className="text-sm font-semibold">Developed By WaizMarco</p>
           </div>
        </div>
      </div>
    </div>
  );
}
