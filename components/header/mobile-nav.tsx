// components/header/mobile-nav.tsx
'use client';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button1';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Logo from '@/components/logo';
import { useState } from 'react';
import { AlignRight } from '@/lib/icons';
import { SETTINGS_QUERYResult, NAVIGATION_QUERYResult } from '@/sanity.types';
import { ModeToggle } from '@/components/menu-toggle';

type SanityLink = NonNullable<NAVIGATION_QUERYResult[0]['links']>[number];

export default function MobileNav({
  navigation,
  settings,
  isSolid = true,
}: {
  navigation: NAVIGATION_QUERYResult;
  settings: SETTINGS_QUERYResult;
  /**
   * When the header has a solid/light background (i.e. not over the hero)
   * we want a dark icon and dark outline. When false (over hero),
   * use white for both so the trigger is visible on imagery.
   */
  isSolid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          aria-label="Open Menu"
          variant="ghost"
          size="icon"
          className={cn(
            'text-inherit shadow-none transition-colors',
            isSolid ? 'hover:bg-muted/60' : 'hover:bg-white/10'
          )}
        >
          {/* Inherit color from parent so it flips with `isSolid` */}
          <AlignRight className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <div className="mx-auto pt-12">
            <Logo
              settings={settings}
              variant="header"
              className="mx-auto max-h-12 w-auto"
              sizes="180px"
            />
          </div>
          <div className="flex justify-center pt-6">
            <ModeToggle />
          </div>
          <div className="sr-only">
            <SheetTitle>Main Navigation</SheetTitle>
            <SheetDescription>Navigate to the website pages</SheetDescription>
          </div>
        </SheetHeader>
        <div className="pt-10 pb-20">
          <div className="container">
            <ul className="list-none text-center  space-y-3">
              {navigation[0]?.links?.map((navItem: SanityLink) => (
                <li key={navItem._key}>
                  <Link
                    onClick={() => setOpen(false)}
                    href={navItem.href || '#'}
                    prefetch={false}
                    target={navItem.target ? '_blank' : undefined}
                    rel={navItem.target ? 'noopener noreferrer' : undefined}
                    className={cn(
                      buttonVariants({
                        variant: navItem.buttonVariant || 'default',
                      }),
                      navItem.buttonVariant === 'ghost' &&
                        'hover:text-decoration-none hover:opacity-50 text-lg p-0 h-auto hover:bg-transparent'
                    )}
                  >
                    {navItem.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
