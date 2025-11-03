"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNotes } from "@/context/notes-provider";
import type { Note, NoteVersion } from "@/lib/types";
import { History, RotateCcw } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { formatDistanceToNow } from 'date-fns';
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

interface NoteHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: Note;
}

export function NoteHistoryDialog({ open, onOpenChange, note }: NoteHistoryDialogProps) {
  const { restoreNoteVersion } = useNotes();
  const [selectedVersion, setSelectedVersion] = useState<NoteVersion | null>(null);

  const handleRestore = (version: NoteVersion) => {
    restoreNoteVersion(note.id, version);
    onOpenChange(false);
  };
  
  const history = note.history || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl grid-rows-[auto,1fr,auto]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Note History
          </DialogTitle>
          <DialogDescription>
            Browse and restore previous versions of your note.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 overflow-hidden h-[60vh]">
            <div className="col-span-1 flex flex-col">
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Versions</h3>
                <ScrollArea className="flex-1 rounded-md border">
                    <div className="p-2 space-y-1">
                        {history.length > 0 ? history.map((version, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedVersion(version)}
                                className={`w-full text-left p-2 rounded-md text-sm transition-colors ${selectedVersion === version ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
                            >
                                <p className="font-medium">{formatDistanceToNow(new Date(version.updatedAt), { addSuffix: true })}</p>
                                <p className="text-xs text-muted-foreground truncate">{version.title}</p>
                            </button>
                        )) : (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                No history found.
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
            <div className="col-span-2 flex flex-col">
                 <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Preview</h3>
                <ScrollArea className="flex-1 rounded-md border p-4 bg-secondary/20">
                    {selectedVersion ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <h1 className="text-xl font-bold mb-2">{selectedVersion.title}</h1>
                            <div dangerouslySetInnerHTML={{ __html: selectedVersion.content }} />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p>Select a version to preview</p>
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>

        <DialogFooter>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button disabled={!selectedVersion} variant="default">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Restore This Version
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Restoring this version will overwrite the current content of the note. This action will be saved as a new entry in the history.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => selectedVersion && handleRestore(selectedVersion)}>Restore</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
