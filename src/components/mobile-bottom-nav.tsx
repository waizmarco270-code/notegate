'use client';

import { Home, Search, Plus, Settings, LayoutGrid } from 'lucide-react';
import { Button } from './ui/button';
import { useNotes } from '@/context/notes-provider';
import { useTheme } from '@/context/theme-provider';
import { cn } from '@/lib/utils';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onMenuClick: () => void;
}

export function MobileBottomNav({ activeTab, setActiveTab, onMenuClick }: MobileBottomNavProps) {
  const { createNote } = useNotes();
  const { setOpenSettings } = useTheme();

  const navItems = [
    { name: 'home', icon: Home, label: 'Home' },
    { name: 'search', icon: Search, label: 'Search' },
    { name: 'new', icon: Plus, label: 'New', isAction: true },
    { name: 'settings', icon: Settings, label: 'Settings' },
    { name: 'menu', icon: LayoutGrid, label: 'Menu' },
  ];

  const handleNavClick = (item: (typeof navItems)[0]) => {
    if (item.isAction) {
      createNote();
    } else if (item.name === 'settings') {
      setOpenSettings(true);
    } else if (item.name === 'menu') {
      onMenuClick();
    } else {
      setActiveTab(item.name);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t z-50 md:hidden">
      <div className="grid h-full grid-cols-5">
        {navItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            className={cn(
              'flex flex-col items-center justify-center h-full rounded-none',
              !item.isAction && activeTab === item.name && item.name !== 'menu'
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
            onClick={() => handleNavClick(item)}
          >
            {item.isAction ? (
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center -mt-6 shadow-lg">
                <item.icon className="h-6 w-6" />
              </div>
            ) : (
              <>
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}
