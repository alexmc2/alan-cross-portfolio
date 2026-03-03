// components/header/desktop-nav.tsx
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button1';
import { cn } from '@/lib/utils';
import { NAVIGATION_QUERYResult } from '@/sanity.types';

type SanityLink = NonNullable<NAVIGATION_QUERYResult[0]['links']>[number];

export default function DesktopNav({
  navigation,
  isSolid,
}: {
  navigation: NAVIGATION_QUERYResult;
  isSolid: boolean;
}) {
  return (
    <div
      className={cn(
        'hidden items-center gap-7 xl:flex',
        isSolid ? 'text-foreground' : 'text-white'
      )}
    >
      {navigation[0]?.links?.map((navItem: SanityLink) => {
        const isGhostVariant =
          !navItem.buttonVariant || navItem.buttonVariant === 'ghost';

        return (
          <Link
            key={navItem._key}
            href={navItem.href || '#'}
            prefetch={false}
            target={navItem.target ? '_blank' : undefined}
            rel={navItem.target ? 'noopener noreferrer' : undefined}
            className={cn(
              buttonVariants({
                variant: navItem.buttonVariant || 'ghost',
              }),
              'text-lg font-semibold tracking-tight transition-colors',
              isGhostVariant &&
                'p-0 h-auto bg-transparent hover:bg-transparent',
              isGhostVariant
                ? isSolid
                  ? 'text-foreground/80 hover:text-foreground'
                  : 'text-white drop-shadow hover:text-white/90'
                : undefined
            )}
          >
            {navItem.title}
          </Link>
        );
      })}
    </div>
  );
}
