// app/about/components/DemoPromoBanner.tsx
'use client';

// components/demo/DemoPromoBanner.tsx
import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

const DEFAULT_MESSAGE =
  'October pilot: £150 · 48-hour delivery · No payment until live';

export type DemoPromoBannerProps = {
  message?: string;
  linkHref?: string;
  linkLabel?: string;
  color?: string;
  isEnabled?: boolean;
  className?: string;
};

export function DemoPromoBanner({
  message = DEFAULT_MESSAGE,

  color,
  isEnabled = true,
  className,
}: DemoPromoBannerProps) {
  const bannerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isEnabled) {
      document.documentElement.style.removeProperty('--promo-banner-height');
      return;
    }

    const root = document.documentElement;

    const updateHeight = () => {
      const height = bannerRef.current?.offsetHeight ?? 0;
      if (height > 0) {
        root.style.setProperty('--promo-banner-height', `${height}px`);
      } else {
        root.style.removeProperty('--promo-banner-height');
      }
    };

    updateHeight();

    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      root.style.removeProperty('--promo-banner-height');
    };
  }, [isEnabled, message]);

  if (!isEnabled) {
    return null;
  }

  const backgroundColor = color?.trim().length ? color : undefined;

  return (
    <div
      ref={bannerRef}
      className={cn(
        'relative z-40 flex w-full items-center justify-center bg-[var(--primary)] dark:bg-sky-600 px-4 py-2 text-center text-xs font-medium text-white shadow-sm md:text-sm',
        className
      )}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <span className="leading-tight">{message}</span>
    </div>
  );
}

export default DemoPromoBanner;
