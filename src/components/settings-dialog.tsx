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

export function SettingsDialog() {
  const { isDarkMode, setDarkMode, openSettings, setOpenSettings } = useTheme();

  return (
    <Dialog open={openSettings} onOpenChange={setOpenSettings}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize the look and feel of your app.
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
