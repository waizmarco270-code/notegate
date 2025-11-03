"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Ear } from "lucide-react";

interface AudioPlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  audioSrc: string | null;
  noteTitle: string;
}

export function AudioPlayerDialog({ open, onOpenChange, audioSrc, noteTitle }: AudioPlayerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline">
            <Ear className="h-5 w-5 text-primary" />
            Listening to Note
          </DialogTitle>
          <DialogDescription>
            Playing audio for: "{noteTitle}"
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {audioSrc ? (
             <audio controls autoPlay src={audioSrc} className="w-full">
              Your browser does not support the audio element.
            </audio>
          ) : (
            <p className="text-center text-muted-foreground">No audio to play.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
