
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
import { useFirestore, useUser } from "@/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, startAt, endAt, limit } from "firebase/firestore";
import type { UserProfile } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Loader2, Search } from "lucide-react";
import { useNotes } from "@/context/notes-provider";
import { debounce } from "lodash";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteId: string;
  currentUserId: string;
}

export function ShareDialog({ open, onOpenChange, noteId, currentUserId }: ShareDialogProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { notes } = useNotes();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchTerm: string) => {
        if (!firestore || searchTerm.length < 3) {
          setSearchResults([]);
          setIsSearching(false);
          return;
        }

        setIsSearching(true);
        setSearchResults([]);

        const searchField = searchTerm.startsWith('@') ? 'username' : 'name';
        const searchValue = searchTerm.startsWith('@') ? searchTerm : searchTerm.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());

        const usersRef = collection(firestore, "users");
        const q = query(
            usersRef, 
            orderBy(searchField), 
            startAt(searchValue), 
            endAt(searchValue + '\uf8ff'),
            limit(10)
        );
        
        try {
          const querySnapshot = await getDocs(q);
          const users: UserProfile[] = [];
          querySnapshot.forEach((doc) => {
            if (doc.id !== currentUserId) {
              users.push({ id: doc.id, ...(doc.data() as Omit<UserProfile, 'id'>) });
            }
          });
          setSearchResults(users);
        } catch (error) {
          console.error("Error searching for user:", error);
          toast({ variant: "destructive", title: "Search failed", description: "An error occurred while searching." });
        }
        setIsSearching(false);
      }, 300),
    [firestore, currentUserId, toast]
  );

  useEffect(() => {
    if (searchQuery.trim().length >= 3) {
      setIsSearching(true);
      debouncedSearch(searchQuery.trim());
    } else {
      setSearchResults([]);
      setIsSearching(false);
      debouncedSearch.cancel();
    }
  }, [searchQuery, debouncedSearch]);


  const handleSendRequest = async () => {
    if (!firestore || !selectedUser || !currentUserId) return;
    
    const noteToShare = notes.find(n => n.id === noteId);
    if (!noteToShare) {
        toast({ variant: "destructive", title: "Note not found", description: "Could not find the note to share." });
        return;
    }

    setIsSending(true);
    try {
      const inboxRef = collection(firestore, `users/${selectedUser.id}/inbox`);
      
      const noteDataPayload = {
          title: noteToShare.title,
          content: noteToShare.content,
          category: noteToShare.category,
          tags: noteToShare.tags,
          createdAt: noteToShare.createdAt,
          updatedAt: noteToShare.updatedAt,
      };

      await addDoc(inboxRef, {
        fromUserId: currentUserId,
        toUserId: selectedUser.id,
        noteId: noteId,
        noteData: noteDataPayload,
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
        debouncedSearch.cancel();
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={resetState}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Note</DialogTitle>
          <DialogDescription>
            Search for a NotesGate user by their name or @username.
          </DialogDescription>
        </DialogHeader>
        
        {!selectedUser ? (
            <div className="space-y-2">
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or @username..."
                  autoComplete="off"
                  className="pl-9"
                />
              </div>
            
              <div className="space-y-2 pt-2 min-h-[6rem]">
                {isSearching && (
                    <div className="flex items-center justify-center p-4 text-muted-foreground">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Searching...</span>
                    </div>
                )}
                {!isSearching && searchResults.length > 0 && (
                   <div className="rounded-md border max-h-48 overflow-y-auto">
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
                )}
                 {!isSearching && searchQuery.length >= 3 && searchResults.length === 0 && (
                     <div className="text-center p-4 text-sm text-muted-foreground">
                        No users found.
                    </div>
                 )}
              </div>
            </div>
        ) : null}

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
                    <Button variant="ghost" onClick={() => { setSelectedUser(null); setSearchQuery(''); }} disabled={isSending}>Back to search</Button>
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
