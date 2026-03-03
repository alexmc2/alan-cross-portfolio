// app/about/components/about-layout.tsx
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export const ABOUT_SECTION_DEFAULT_WIDTH = 'max-w-5xl';

type AboutSectionProps = {
  children: ReactNode;
  sectionClassName?: string;
  contentClassName?: string;
  maxWidthClassName?: string;
};

export function AboutSection({
  children,
  sectionClassName,
  contentClassName,
  maxWidthClassName,
}: AboutSectionProps) {
  const resolvedMaxWidth = maxWidthClassName ?? ABOUT_SECTION_DEFAULT_WIDTH;

  return (
    <section className={cn('py-16 sm:py-20', sectionClassName)}>
      <div className="container">
        <div
          className={cn('mx-auto w-full px-6', resolvedMaxWidth, contentClassName)}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
