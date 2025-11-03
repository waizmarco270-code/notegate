
"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useUser, useCollection, useDoc } from "@/firebase";
import { collection, query, where, doc, updateDoc, deleteDoc, getDoc, serverTimestamp } from "firebase/firestore";
import type { SharedNote, UserProfile, Note } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Loader2, Inbox, Check, X } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useNotes } from "@/context/notes-provider";

interface InboxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ShareRequestCard({ request }: { request: SharedNote & { id: string } }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const { importSharedNote } = useNotes();
    const [isProcessing, setIsProcessing] = useState(false);

    const fromUserRef = useMemo(() => {
        if (!firestore || !request.fromUserId) return null;
        return doc(firestore, "users", request.fromUserId);
    }, [firestore, request.fromUserId]);
    const { data: fromUser } = useDoc<UserProfile>(fromUserRef);

    const noteRef = useMemo(() => {
        if (!firestore || !request.fromUserId || !request.noteId) return null;
        return doc(firestore, `users/${request.fromUserId}/notes/${request.noteId}`);
    }, [firestore, request.fromUserId, request.noteId]);
    const { data: note, loading: noteLoading } = useDoc<Note>(noteRef);

    const handleAccept = async () => {
        if (!firestore || !user || !note) return;
        setIsProcessing(true);
        try {
            const shareRef = doc(firestore, `users/${user.uid}/inbox/${request.id}`);
            await updateDoc(shareRef, { status: "accepted" });
            
            importSharedNote({
                ...note,
                // Ensure id is present if it's not on the note object itself from firestore
                id: note.id || request.noteId, 
            });

            toast({ title: "Note accepted!", description: `"${note.title}" has been added to your notes.` });
            await deleteDoc(shareRef);
        } catch (error) {
            console.error("Error accepting share:", error);
            toast({ variant: "destructive", title: "Accept failed", description: "Could not accept the note." });
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!firestore || !user) return;
        setIsProcessing(true);
        try {
            const shareRef = doc(firestore, `users/${user.uid}/inbox/${request.id}`);
            await updateDoc(shareRef, { status: "rejected" });
            toast({ title: "Note rejected." });
            await deleteDoc(shareRef);
        } catch (error) {
            console.error("Error rejecting share:", error);
            toast({ variant: "destructive", title: "Reject failed" });
            setIsProcessing(false);
        }
    };
    
    const getInitials = (name?: string | null) => {
        if (!name) return "";
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }

    if (noteLoading) {
        return <div className="p-4 text-center">Loading note...</div>
    }

    if (!note || !fromUser) {
        return null;
    }

    return (
        <div className="flex items-center justify-between gap-3 p-3 rounded-md border bg-secondary">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={fromUser.photoURL || ''} alt={fromUser.name || 'User'} />
                    <AvatarFallback>{getInitials(fromUser.name)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-semibold">
                        <span className="font-bold">{fromUser.username}</span> wants to share a note with you:
                    </p>
                    <p className="text-sm text-muted-foreground font-medium italic">"{note.title}"</p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button size="icon" variant="outline" className="h-8 w-8 bg-green-100 text-green-700 hover:bg-green-200" onClick={handleAccept} disabled={isProcessing}>
                    <Check className="h-4 w-4" />
                </Button>
                 <Button size="icon" variant="outline" className="h-8 w-8 bg-red-100 text-red-700 hover:bg-red-200" onClick={handleReject} disabled={isProcessing}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export function InboxDialog({ open, onOpenChange }: InboxDialogProps) {
  const { user } = useUser();
  const firestore = useFirestore();

  const inboxQuery = useMemo(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, `users/${user.uid}/inbox`),
      where("status", "==", "pending")
    );
  }, [user, firestore]);

  const { data: inboxItems, loading } = useCollection<SharedNote>(inboxQuery);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Inbox className="h-5 w-5" />
            Inbox
          </DialogTitle>
          <DialogDescription>
            Here are the notes shared with you. Accept them to add to your list.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-96 -mx-6 px-6">
            <div className="space-y-3 py-4">
            {loading && (
                <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            )}
            {!loading && (!inboxItems || inboxItems.length === 0) && (
                <div className="text-center text-muted-foreground p-8">
                <p>Your inbox is empty.</p>
                </div>
            )}
            {!loading && inboxItems && inboxItems.map(request => (
                <ShareRequestCard key={request.id} request={request} />
            ))}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
