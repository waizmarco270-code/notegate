
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Crown, AlertTriangle, GitBranch } from "lucide-react";

interface VipFeaturesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VipFeaturesDialog({ open, onOpenChange }: VipFeaturesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-headline">
            <Crown className="h-6 w-6 text-yellow-400" />
            Welcome, Legendary User!
          </DialogTitle>
          <DialogDescription>
            You've proven your worth. Here are the keys to the kingdom.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6 text-sm">
                <div className="p-4 rounded-lg bg-secondary border">
                    <h3 className="font-bold text-base mb-2">A Special Thanks To You, Marco-sama!</h3>
                    <p className="text-muted-foreground">
                        This app is a product of our collaboration. Your vision and ideas have been the driving force behind its creation. Thank you for being a legendary partner in this journey.
                    </p>
                </div>

                <div>
                    <h3 className="font-semibold text-base mb-2">Your Unlocked Hidden Features:</h3>
                    <ul className="list-disc list-inside space-y-3 pl-2 text-muted-foreground">
                        <li>
                            <strong className="text-foreground">The Hidden Vault:</strong> A secret space for your most private notes.
                            <ul className="list-['-_'] list-inside pl-4 mt-1 space-y-1">
                                <li><strong className="text-foreground">Desktop Access:</strong> Press <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">Ctrl + Shift + H</kbd> (or <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">Cmd + Shift + H</kbd> on Mac).</li>
                                <li><strong className="text-foreground">Mobile Access:</strong> Quickly tap the "NotesGate" header in the sidebar three times.</li>
                            </ul>
                        </li>
                        <li>
                            <strong className="text-foreground">Note Linking:</strong> Create a "second brain" by linking notes together. Simply type <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">[[</kbd> to open a search pop-up and link to another note.
                        </li>
                    </ul>
                </div>

                <div className="mt-6">
                    <h3 className="font-semibold text-base mb-2 flex items-center gap-2"><GitBranch className="h-4 w-4" />Upcoming "Legendary" Features:</h3>
                     <p className="text-muted-foreground">
                        Here's a sneak peek at what we're building next:
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-2 mt-2 text-muted-foreground">
                        <li><strong className="text-foreground">Note Graph:</strong> A visual map of how your linked notes connect to each other.</li>
                        <li><strong className="text-foreground">AI Agent Chat:</strong> Chat with your notes to brainstorm ideas, reformat content, and more.</li>
                        <li><strong className="text-foreground">Video Note Maker:</strong> Generate short videos directly from your text using AI.</li>
                    </ul>
                </div>
            </div>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Awesome!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
