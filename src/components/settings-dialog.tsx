"use client";

import { useRef, useState } from "react";
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
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Download, Upload, AlertCircle, ShieldCheck, KeyRound, Type } from "lucide-react";
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
import { PrivacyDialog } from "./privacy-dialog";
import { SecretDevQuizDialog } from "./secret-dev-quiz-dialog";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { VipFeaturesDialog } from "./vip-features-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { FontTheme } from "@/context/theme-provider";

export function SettingsDialog() {
  const { isDarkMode, setDarkMode, fontTheme, setFontTheme, openSettings, setOpenSettings } = useTheme();
  const { notes, userCategories, importData } = useNotes();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPrivacyOpen, setPrivacyOpen] = useState(false);
  const [isQuizOpen, setQuizOpen] = useState(false);
  const [isVipOpen, setVipOpen] = useState(false);

  const [devQuizStatus, setDevQuizStatus] = useLocalStorage<"not-attempted" | "passed" | "failed">(
    "devQuizStatus",
    "not-attempted"
  );

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
  
  const handleSecretClick = () => {
    if (devQuizStatus === 'passed') {
      setVipOpen(true);
    } else {
      setQuizOpen(true);
    }
  }

  return (
    <>
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

             <div className="flex items-center justify-between">
                <Label htmlFor="font-style" className="flex flex-col gap-1">
                  <span>Font Style</span>
                  <span className="text-xs text-muted-foreground">Change the app's typography.</span>
                </Label>
                <Select value={fontTheme} onValueChange={(value: FontTheme) => setFontTheme(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a font theme" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="elegant">Elegant</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <Separator />

            <div className="space-y-4">
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
            
            <Separator />
            
            <div className="space-y-4">
              <Label>About &amp; Security</Label>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Review the application's privacy policy.</p>
                <Button variant="outline" size="sm" onClick={() => setPrivacyOpen(true)}>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  View Privacy Policy
                </Button>
              </div>
              {devQuizStatus !== 'failed' && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Discover legendary app secrets.</p>
                  <Button variant="outline" size="sm" onClick={handleSecretClick}>
                    <KeyRound className="mr-2 h-4 w-4" />
                    {devQuizStatus === 'passed' ? 'View VIP Secrets' : 'Unlock Developer Secrets'}
                  </Button>
                </div>
              )}
            </div>

          </div>
        </DialogContent>
      </Dialog>
      <PrivacyDialog open={isPrivacyOpen} onOpenChange={setPrivacyOpen} />
      <SecretDevQuizDialog
        open={isQuizOpen}
        onOpenChange={setQuizOpen}
        onSuccess={() => {
          setDevQuizStatus('passed');
          setQuizOpen(false);
          setVipOpen(true);
        }}
        onFailure={() => {
          setDevQuizStatus('failed');
          setQuizOpen(false);
        }}
      />
      <VipFeaturesDialog open={isVipOpen} onOpenChange={setVipOpen} />
    </>
  );
}
