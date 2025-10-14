"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Sparkles, ShieldCheck } from "lucide-react";
import { PrivacyContent } from "./privacy-content";

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WelcomeDialog({ open, onOpenChange }: WelcomeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Welcome to NotesGate!
          </DialogTitle>
          <DialogDescription>
            Before you start your legendary note-taking journey, here's a quick note on your privacy.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-start gap-4 p-4 rounded-lg bg-background my-4">
             <ShieldCheck className="h-8 w-8 text-green-500 mt-1 flex-shrink-0" />
             <div>
                <h3 className="font-bold">Your Data is 100% Yours and 100% Private.</h3>
                <p className="text-muted-foreground text-sm">
                    All your notes, categories, and settings are stored directly on your device in your browser's local storage. Nothing is ever sent to a server. This means your data is completely private and secure.
                </p>
             </div>
        </div>

        <ScrollArea className="max-h-[30vh] pr-6 border rounded-lg p-4">
           <h4 className="font-semibold mb-2">Key Privacy Points:</h4>
           <PrivacyContent />
        </ScrollArea>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Got it, Let's Start!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
