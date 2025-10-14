"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/context/theme-provider";
import { themes } from "@/lib/themes";

export function SettingsDialog() {
  const { isDarkMode, setDarkMode, theme, setTheme, openSettings, setOpenSettings } = useTheme();

  return (
    <Dialog open={openSettings} onOpenChange={setOpenSettings}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-headline">Settings</DialogTitle>
          <DialogDescription>
            Customize the look and feel of your notes app.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setTheme(t.name)}
                  className={`flex items-center gap-3 p-2 rounded-md border-2 ${
                    theme === t.name ? "border-primary" : "border-transparent"
                  }`}
                >
                  <div className="flex -space-x-1">
                    <div className={`w-5 h-5 rounded-full ${t.colors.primary}`} />
                    <div className={`w-5 h-5 rounded-full ${t.colors.secondary}`} />
                    <div className={`w-5 h-5 rounded-full ${t.colors.accent}`} />
                  </div>
                  <span className="text-sm font-medium capitalize">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
