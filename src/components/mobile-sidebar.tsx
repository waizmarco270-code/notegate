'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from './ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  Home,
  Star,
  Briefcase,
  Lightbulb,
  Folder,
  LogOut,
  Inbox,
  Settings,
  KeyRound,
} from 'lucide-react';
import { useUser } from '@/firebase';
import { useNotes } from '@/context/notes-provider';
import { useTheme } from '@/context/theme-provider';
import { AuthDialog } from './auth-dialog';
import { InboxDialog } from './inbox-dialog';
import { cn } from '@/lib/utils';

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenVault: () => void;
  onSelectCategory: (category: string | null) => void;
  activeCategory: string | null;
}

export function MobileSidebar({
  open,
  onOpenChange,
  onOpenVault,
  onSelectCategory,
  activeCategory,
}: MobileSidebarProps) {
  const { user, auth } = useUser();
  const { allCategories } = useNotes();
  const { setOpenSettings } = useTheme();
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const [isInboxOpen, setInboxOpen] = useState(false);

  const getInitials = (name?: string | null) => {
    if (!name) return '...';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleLogout = () => {
    auth?.signOut();
    onOpenChange(false);
  };
  
  const categoryIcons: { [key: string]: React.ElementType } = {
    Personal: Home,
    Work: Briefcase,
    Ideas: Lightbulb,
    Favorites: Star,
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-80 p-0">
          <SheetHeader className="p-4 border-b">
            {user ? (
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user.photoURL || ''}
                    alt={user.displayName || 'User'}
                  />
                  <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user.displayName}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ) : (
              <SheetTitle>Menu</SheetTitle>
            )}
          </SheetHeader>
          <div className="p-4 space-y-2">
            {!user ? (
              <Button
                className="w-full"
                onClick={() => {
                  setAuthDialogOpen(true);
                  onOpenChange(false);
                }}
              >
                Login / Sign Up
              </Button>
            ) : null}

            <h3 className="text-sm font-semibold text-muted-foreground pt-2">Notes</h3>
            <Button
              variant={activeCategory === null ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onSelectCategory('All Notes')}
            >
              <Folder className="mr-2 h-4 w-4" /> All Notes
            </Button>
            <Button
              variant={activeCategory === 'Favorites' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onSelectCategory('Favorites')}
            >
              <Star className="mr-2 h-4 w-4" /> Favorites
            </Button>
            
            <h3 className="text-sm font-semibold text-muted-foreground pt-2">Categories</h3>
             {allCategories.map(category => {
                  const Icon = categoryIcons[category] || Folder;
                  return (
                  <Button 
                    key={category} 
                    variant={activeCategory === category ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => onSelectCategory(category)}
                  >
                      <Icon className="mr-2 h-4 w-4" />
                      {category}
                  </Button>
                  );
              })}


            <h3 className="text-sm font-semibold text-muted-foreground pt-2">General</h3>
            {user && (
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setInboxOpen(true);
                  onOpenChange(false);
                }}
              >
                <Inbox className="mr-2 h-4 w-4" /> Inbox
              </Button>
            )}
             <Button variant="ghost" className="w-full justify-start" onClick={onOpenVault}>
                <KeyRound className="mr-2 h-4 w-4" /> Hidden Vault
            </Button>
             <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                setOpenSettings(true);
                onOpenChange(false);
              }}
            >
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
            {user && (
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
      <AuthDialog open={isAuthDialogOpen} onOpenChange={setAuthDialogOpen} />
      {user && <InboxDialog open={isInboxOpen} onOpenChange={setInboxOpen} />}
    </>
  );
}
