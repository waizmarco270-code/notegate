
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
import { useFirestore, useUser, useCollection } from "@/firebase";
import { collection, query, where, doc, deleteDoc } from "firebase/firestore";
import type { SharedNote, UserProfile } from "@/lib/types";
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

    // Data is now embedded in the request, no need for extra fetches for the note itself.
    const fromUserRef = useMemo(() => {
        if (!firestore || !request.fromUserId) return null;
        return doc(firestore, "users", request.fromUserId);
    }, [firestore, request.fromUserId]);
    const { data: fromUser, loading: fromUserLoading } = useDoc<UserProfile>(fromUserRef);

    const handleAccept = async () => {
        if (!firestore || !user || !request.noteData) return;
        setIsProcessing(true);
        try {
            // The full note object is embedded in the request.noteData
            await importSharedNote({
                ...request.noteData,
                id: request.noteId, 
            });
            
            // After successful import, delete the share request from the user's inbox
            const shareRef = doc(firestore, `users/${user.uid}/inbox/${request.id}`);
            await deleteDoc(shareRef);

            toast({ title: "Note accepted!", description: `"${request.noteData.title}" has been added to your notes.` });

        } catch (error) {
            console.error("Error accepting share:", error);
            toast({ variant: "destructive", title: "Accept failed", description: "Could not accept the note." });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!firestore || !user) return;
        setIsProcessing(true);
        try {
            const shareRef = doc(firestore, `users/${user.uid}/inbox/${request.id}`);
            await deleteDoc(shareRef);
            toast({ title: "Note rejected." });
        } catch (error) {
            console.error("Error rejecting share:", error);
            toast({ variant: "destructive", title: "Reject failed" });
        } finally {
            setIsProcessing(false);
        }
    };
    
    const getInitials = (name?: string | null) => {
        if (!name) return "";
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }

    if (fromUserLoading) {
        return <div className="p-4 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></div>
    }

    // If the sender's user data or the embedded note data is missing, don't show.
    if (!fromUser || !request.noteData) {
        return null;
    }

    return (
        <div className="flex items-center justify-between gap-3 p-3 rounded-md border bg-secondary">
            <div className="flex items-center gap-3 overflow-hidden">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={fromUser.photoURL || ''} alt={fromUser.name || 'User'} />
                    <AvatarFallback>{getInitials(fromUser.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold truncate">
                        <span className="font-bold">{fromUser.username}</span> wants to share a note:
                    </p>
                    <p className="text-sm text-muted-foreground font-medium italic truncate">"{request.noteData.title}"</p>
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
