"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle } from "lucide-react";

interface PasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "set" | "update" | "prompt";
  noteId?: string;
  correctPassword?: string | null;
  onSuccess?: () => void;
  onSetPassword?: (password: string | null) => void;
}

export function PasswordDialog({
  open,
  onOpenChange,
  mode,
  correctPassword,
  onSuccess,
  onSetPassword,
}: PasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();
  
  useEffect(() => {
    if (!open) {
      setPassword("");
      setConfirmPassword("");
      setError("");
    }
  }, [open]);

  const handlePrompt = () => {
    if (password === correctPassword) {
      setError("");
      setPassword("");
      onSuccess?.();
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const handleSet = () => {
    if (!password) {
        setError("Password cannot be empty.");
        return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setPassword("");
    setConfirmPassword("");
    onSetPassword?.(password);
    toast({ title: "Password set successfully." });
  };
  
  const handleRemove = () => {
    onSetPassword?.(null);
    toast({ title: "Password removed." });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "prompt") {
      handlePrompt();
    } else {
      handleSet();
    }
  };

  const title = mode === "prompt" ? "Enter Password" : mode === 'update' ? "Update Password" : "Set Password";
  const description = mode === "prompt" 
    ? "This note is password protected. Enter the password to unlock." 
    : "Create or update the password for this note.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {(mode === "set" || mode === "update") && (
                <Alert variant="default" className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
                    <AlertCircle className="h-4 w-4 !text-yellow-600 dark:!text-yellow-400" />
                    <AlertDescription className="text-yellow-700 dark:text-yellow-300 text-xs">
                        Please save this password somewhere safe. There is no way to recover a forgotten password.
                    </AlertDescription>
                </Alert>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                className="col-span-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            {(mode === "set" || mode === "update") && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirm-password" className="text-right">
                  Confirm
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  className="col-span-3"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
            {error && <p className="text-destructive text-sm col-span-4 text-center">{error}</p>}
          </div>
          <DialogFooter>
            {mode === 'update' && <Button type="button" variant="destructive" onClick={handleRemove}>Remove Password</Button>}
            <Button type="submit">{mode === 'prompt' ? 'Unlock' : 'Save Password'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
