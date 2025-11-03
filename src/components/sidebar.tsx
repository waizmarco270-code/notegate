"use client";

import { Home, Plus, Search, Moon, Sun, Star, Briefcase, Lightbulb, ChevronDown, Folder, Settings, User, LogOut, Inbox } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NoteList } from "@/components/note-list";
import type { Note } from "@/lib/types";
import { useTheme } from "@/context/theme-provider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { useNotes } from "@/context/notes-provider";
import { cn } from "@/lib/utils";
import { AuthDialog } from "./auth-dialog";
import { useState, useMemo } from "react";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { collection, query, where } from "firebase/firestore";
import { InboxDialog } from "./inbox-dialog";

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onNewNote: () => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSelectCategory: (category: string | null) => void;
  activeCategory: string | null;
  onDeleteNote: (id: string) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onSetPassword: (note: Note) => void;
  onSetCategory: (note: Note) => void;
}

export function Sidebar({ 
  notes, 
  activeNoteId, 
  onSelectNote, 
  onNewNote, 
  searchTerm, 
  onSearchTermChange, 
  onSelectCategory, 
  activeCategory,
  onDeleteNote,
  onToggleFavorite,
  onSetPassword,
  onSetCategory
}: SidebarProps) {
  const { isDarkMode, setDarkMode, setOpenSettings } = useTheme();
  const { allCategories, setActiveNoteId } = useNotes();
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const [isInboxOpen, setInboxOpen] = useState(false);
  const { user, auth } = useUser();
  const firestore = useFirestore();

  const inboxQuery = useMemo(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, `users/${user.uid}/inbox`),
      where("status", "==", "pending")
    );
  }, [user, firestore]);

  const { data: inboxItems } = useCollection(inboxQuery);
  const pendingRequests = inboxItems?.length || 0;

  const categoryIcons: { [key: string]: React.ElementType } = {
    "Personal": User,
    "Work": Briefcase,
    "Ideas": Lightbulb,
    "Favorites": Star,
  };
  
  const handleGoHome = () => {
    setActiveNoteId(null);
    onSelectCategory(null);
  };
  
  const handleLogout = () => {
    auth?.signOut();
  }

  const getInitials = (name?: string | null) => {
    if (!name) return "";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <>
      <aside className="w-80 min-w-[320px] flex flex-col bg-background/50 p-4 space-y-4">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="NotesGate Logo"
              width={28}
              height={28}
              className="rounded-md"
            />
            <h1 className="text-2xl font-bold text-foreground">NotesGate</h1>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setDarkMode(!isDarkMode)} aria-label="Toggle theme">
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setOpenSettings(true)} aria-label="Open settings">
                <Settings className="h-5 w-5" />
            </Button>
            {user ? (
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                       <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                       <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setAuthDialogOpen(true)} aria-label="Open authentication">
                  <User className="h-5 w-5" />
              </Button>
            )}
          </div>
        </header>

        <Button variant="default" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={onNewNote}>
          <Plus className="h-4 w-4 mr-2" /> New Note
        </Button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search notes..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
          />
        </div>

        <nav className="flex flex-col gap-1">
          <Button 
              variant={"ghost"}
              className="w-full justify-start"
              onClick={handleGoHome}
            >
              <Home className="mr-2 h-4 w-4" /> Home
          </Button>
          {user && (
            <Button
              variant="ghost"
              className="w-full justify-start relative"
              onClick={() => setInboxOpen(true)}
            >
              <Inbox className="mr-2 h-4 w-4" />
              Inbox
              {pendingRequests > 0 && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  {pendingRequests}
                </span>
              )}
            </Button>
          )}
          <Button 
              variant={activeCategory === null ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onSelectCategory("All Notes")}
            >
              <Folder className="mr-2 h-4 w-4" /> All Notes
          </Button>
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                  <Folder className="mr-2 h-4 w-4" /> Categories
                  <ChevronDown className="h-4 w-4 ml-auto" />
              </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
              <DropdownMenuItem 
                onClick={() => onSelectCategory("Favorites")}
                className={cn(activeCategory === "Favorites" && "bg-secondary")}
              >
                  <Star className="mr-2 h-4 w-4" />
                  Favorites
              </DropdownMenuItem>
              {allCategories.length > 0 && <DropdownMenuSeparator />}
              {allCategories.map(category => {
                  const Icon = categoryIcons[category] || Folder;
                  return (
                  <DropdownMenuItem 
                    key={category} 
                    onClick={() => onSelectCategory(category)}
                    className={cn(activeCategory === category && "bg-secondary")}
                  >
                      <Icon className="mr-2 h-4 w-4" />
                      {category}
                  </DropdownMenuItem>
                  );
              })}
              </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        

        <NoteList 
          notes={notes} 
          activeNoteId={activeNoteId} 
          onSelectNote={onSelectNote}
          onDeleteNote={onDeleteNote}
          onToggleFavorite={onToggleFavorite}
          onSetPassword={onSetPassword}
          onSetCategory={onSetCategory}
        />
      </aside>
      <AuthDialog open={isAuthDialogOpen} onOpenChange={setAuthDialogOpen} />
      {user && <InboxDialog open={isInboxOpen} onOpenChange={setInboxOpen} />}
    </>
  );
}
