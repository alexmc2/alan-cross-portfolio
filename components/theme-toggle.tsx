'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

type ThemeToggleProps = {
  showLabel?: boolean;
  className?: string;
  tone?: 'theme' | 'overlay';
  onToggle?: () => void;
};

function SunIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="block h-[18px] w-[18px]"
      fill="none"
    >
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M10 1.75v2.1M10 16.15v2.1M18.25 10h-2.1M3.85 10h-2.1M15.83 4.17l-1.48 1.48M5.65 14.35l-1.48 1.48M15.83 15.83l-1.48-1.48M5.65 5.65 4.17 4.17"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="block h-[18px] w-[18px]"
      fill="none"
    >
      <path
        d="M13.68 2.25a7.25 7.25 0 1 0 4.07 13.26A7.75 7.75 0 0 1 13.68 2.25Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ThemeToggle({
  showLabel = false,
  className,
  tone = 'theme',
  onToggle,
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const hasHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const currentTheme =
    hasHydrated && (theme === 'light' || theme === 'dark') ? theme : 'dark';
  const isLight = currentTheme === 'light';
  const nextTheme = isLight ? 'dark' : 'light';
  const actionLabel = nextTheme === 'light' ? 'Light mode' : 'Dark mode';
  const ariaLabel = `Switch to ${nextTheme} mode`;

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      title={ariaLabel}
      onClick={() => { setTheme(nextTheme); onToggle?.(); }}
      className={cn(
        'inline-flex shrink-0 items-center p-0 leading-none transition-colors duration-200 focus-visible:outline-none',
        tone === 'overlay'
          ? 'text-[var(--color-hero-text-primary)] opacity-92 hover:opacity-100 focus-visible:opacity-100'
          : 'text-text-secondary hover:text-text-primary focus-visible:text-text-primary',
        showLabel ? 'justify-start gap-3' : 'h-5 w-5 justify-center',
        className,
      )}
    >
      <span className="relative flex h-[18px] w-[18px] items-center justify-center">
        <span
          className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-150 ease-out ${
            isLight ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <SunIcon />
        </span>
        <span
          className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-150 ease-out ${
            isLight ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <MoonIcon />
        </span>
      </span>
      {showLabel ? <span>{actionLabel}</span> : null}
    </button>
  );
}
