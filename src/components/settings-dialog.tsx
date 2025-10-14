"use client";

import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/context/theme-provider";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Download, Upload, AlertCircle } from "lucide-react";
import { useNotes } from "@/context/notes-provider";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function SettingsDialog() {
  const { isDarkMode, setDarkMode, openSettings, setOpenSettings } = useTheme();
  const { notes, userCategories, importData } = useNotes();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportData = () => {
    const dataToExport = {
      notes: notes,
      categories: userCategories,
    };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "legendary-notes-backup.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Data exported successfully!" });
    setOpenSettings(false);
  };
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== "string") {
            throw new Error("File is not valid text");
        }
        const parsedData = JSON.parse(text);
        if (Array.isArray(parsedData.notes) && Array.isArray(parsedData.categories)) {
          importData(parsedData);
          toast({ title: "Data imported successfully!" });
          setOpenSettings(false);
        } else {
          throw new Error("Invalid data structure in JSON file.");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: error instanceof Error ? error.message : "Could not read or parse the file.",
        });
      }
    };
    reader.readAsText(file);
    // Reset file input
    if(event.target) event.target.value = '';
  };

  return (
    <Dialog open={openSettings} onOpenChange={setOpenSettings}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize the look and feel of your app, and manage your data.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode" className="flex flex-col gap-1">
                <span>Dark Mode</span>
                <span className="text-xs text-muted-foreground">Toggle the dark and light theme.</span>
            </Label>
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={setDarkMode}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Data Management</Label>
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Export all your data to a JSON file.</p>
                <Button variant="outline" size="sm" onClick={handleExportData}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                </Button>
            </div>
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Import data from a backup file.</p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Import Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently overwrite your current notes and categories. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleImportClick}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileImport}
                  className="hidden"
                  accept="application/json"
                />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
