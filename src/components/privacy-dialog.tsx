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
import { ShieldCheck } from "lucide-react";
import { PrivacyContent } from "./privacy-content";

interface PrivacyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrivacyDialog({ open, onOpenChange }: PrivacyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Privacy Policy
          </DialogTitle>
          <DialogDescription>
            Your privacy is our top priority. Here's how we handle your data.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-6">
          <PrivacyContent />
        </ScrollArea>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
