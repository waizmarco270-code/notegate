
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
import { useFirestore } from "@/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import type { UserProfile } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Loader2 } from "lucide-react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteId: string;
  currentUserId: string;
}

export function ShareDialog({ open, onOpenChange, noteId, currentUserId }: ShareDialogProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults([]);
    setSelectedUser(null);
    
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("username", "==", searchQuery.trim()));
    
    try {
      const querySnapshot = await getDocs(q);
      const users: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        // Exclude current user from search results
        if (doc.id !== currentUserId) {
          users.push({ id: doc.id, ...(doc.data() as Omit<UserProfile, 'id'>) });
        }
      });
      setSearchResults(users);
      if (users.length === 0) {
        toast({ variant: "destructive", title: "User not found." });
      }
    } catch (error) {
      console.error("Error searching for user:", error);
      toast({ variant: "destructive", title: "Search failed", description: "An error occurred while searching." });
    }
    setIsSearching(false);
  };

  const handleSendRequest = async () => {
    if (!firestore || !selectedUser) return;

    setIsSending(true);
    try {
      const inboxRef = collection(firestore, `users/${selectedUser.id}/inbox`);
      await addDoc(inboxRef, {
        fromUserId: currentUserId,
        toUserId: selectedUser.id,
        noteId: noteId,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      toast({ title: "Share request sent!", description: `Your note has been shared with ${selectedUser.username}.` });
      onOpenChange(false);
    } catch (error) {
      console.error("Error sending share request:", error);
      toast({ variant: "destructive", title: "Failed to send", description: "An error occurred while sending the request." });
    }
    setIsSending(false);
  };
  
  const getInitials = (name?: string | null) => {
    if (!name) return "";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }
  
  const resetState = (isOpen: boolean) => {
    if (!isOpen) {
        setSearchQuery("");
        setSearchResults([]);
        setSelectedUser(null);
        setIsSearching(false);
        setIsSending(false);
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={resetState}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Note</DialogTitle>
          <DialogDescription>
            Search for a NotesGate user by their exact username (e.g., @johndoe) to share this note with.
          </DialogDescription>
        </DialogHeader>
        
        {!selectedUser ? (
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username-search">Username</Label>
                <Input
                  id="username-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="@username"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSearching}>
                {isSearching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Search User
              </Button>
            </form>
        ) : null}

        {isSearching && <div className="text-center p-4">Searching...</div>}
        
        {searchResults.length > 0 && !selectedUser && (
           <div className="space-y-2 pt-4">
             <Label>Search Results</Label>
             <div className="rounded-md border max-h-40 overflow-y-auto">
                {searchResults.map(user => (
                    <div key={user.id} onClick={() => setSelectedUser(user)} className="flex items-center gap-3 p-2 hover:bg-secondary cursor-pointer border-b last:border-b-0">
                         <Avatar className="h-9 w-9">
                           <AvatarImage src={user.photoURL || ''} alt={user.name || 'User'} />
                           <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.username}</p>
                        </div>
                    </div>
                ))}
             </div>
           </div>
        )}

        {selectedUser && (
            <div className="space-y-4 pt-4">
                <p className="text-sm">You are about to share this note with:</p>
                <div className="flex items-center gap-3 p-3 rounded-md border bg-secondary">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedUser.photoURL || ''} alt={selectedUser.name || 'User'} />
                        <AvatarFallback>{getInitials(selectedUser.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{selectedUser.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedUser.username}</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setSelectedUser(null)} disabled={isSending}>Back to search</Button>
                    <Button onClick={handleSendRequest} disabled={isSending}>
                      {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Send Share Request
                    </Button>
                </DialogFooter>
            </div>
        )}
        
      </DialogContent>
    </Dialog>
  );
}

