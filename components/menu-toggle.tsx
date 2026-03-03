// components/menu-toggle.tsx
'use client';

import * as React from 'react';
import { Moon, Sun } from '@/lib/icons';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button1';
import { cn } from '@/lib/utils';

export function ModeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'text-inherit hover:bg-transparent hover:text-inherit focus-visible:ring-0',
        className
      )}
      onClick={toggleTheme}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
