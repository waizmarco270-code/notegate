"use client";

import { useState } from "react";
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

  const handleSubmit = () => {
    if (mode === "prompt") {
      handlePrompt();
    } else {
      handleSet();
    }
  };

  const title = mode === "prompt" ? "Enter Password" : mode === 'update' ? "Update Password" : "Set Password";
  const description = mode === "prompt" ? "This note is password protected. Please enter the password to view." : "Create a password to secure this note.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
            />
          </div>
          {(mode === "set" || mode === "update") && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirm-password"הclassName="text-right">
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
          {mode === 'update' && <Button variant="destructive" onClick={handleRemove}>Remove Password</Button>}
          <Button onClick={handleSubmit}>{mode === 'prompt' ? 'Unlock' : 'Save Password'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
