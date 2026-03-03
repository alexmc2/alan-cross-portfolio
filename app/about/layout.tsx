// app/about/layout.tsx
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import DemoPromoBanner from './components/DemoPromoBanner';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/menu-toggle';

type AboutLayoutProps = {
  children: ReactNode;
};

const BOOK_A_CALL_EMAIL = 'alexandramcgarryx@gmail.com';
const BOOK_A_CALL_SUBJECT = 'Interested in a portfolio website';

const CTA_MAILTO = `mailto:${BOOK_A_CALL_EMAIL}?subject=${encodeURIComponent(
  BOOK_A_CALL_SUBJECT
)}`;

export default function AboutLayout({ children }: AboutLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <DemoPromoBanner />
      <header className="border-b border-border/60 bg-background/95 py-3">
        <div className="container flex flex-col items-start justify-between gap-4 px-6 text-sm font-medium sm:flex-row sm:items-center">
          <div className="flex flex-col gap-1">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight hover:text-primary"
            >
              Alan Cross Portfolio
            </Link>
            <span className="text-muted-foreground">
              Portfolio website built with Next.js and Sanity
            </span>
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">
              Full website
            </Link>

            <ModeToggle />
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/60 bg-muted/40 py-8">
        <div className="container px-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Alan Cross Portfolio. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
