"use client";

import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertTriangle } from "lucide-react";
import type { Note } from "@/lib/types";

interface DeleteNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: Note | null;
  onConfirmDelete: () => void;
}

export function DeleteNoteDialog({ open, onOpenChange, note, onConfirmDelete }: DeleteNoteDialogProps) {
  const [inputValue, setInputValue] = useState("");
  const isSecureDelete = note?.isFavorite ?? false;

  useEffect(() => {
    if (!open) {
      setInputValue("");
    }
  }, [open]);

  const canDelete = isSecureDelete ? inputValue === "DELETE" : true;

  const handleConfirm = () => {
    if (canDelete) {
      onConfirmDelete();
    }
  };

  if (!note) {
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the note titled "{note.title}".
          </AlertDialogDescription>
        </AlertDialogHeader>

        {isSecureDelete && (
            <div className="space-y-4 py-4">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>High-Security Deletion</AlertTitle>
                    <AlertDescription>
                        This is a favorite note. To confirm deletion, please type <strong>DELETE</strong> in the box below.
                    </AlertDescription>
                </Alert>
                 <div className="grid gap-2">
                    <Label htmlFor="delete-confirm-input">Type "DELETE" to confirm</Label>
                    <Input 
                        id="delete-confirm-input"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        autoFocus
                    />
                </div>
            </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!canDelete}
            className="bg-destructive hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
