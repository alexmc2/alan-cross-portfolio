'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

const SHOW_AFTER_SCROLL_Y = 500;

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const nextVisible = window.scrollY > SHOW_AFTER_SCROLL_Y;
      setIsVisible((current) =>
        current === nextVisible ? current : nextVisible,
      );
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Tooltip.Provider delayDuration={120}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            aria-label="Back to top"
            aria-hidden={!isVisible}
            tabIndex={isVisible ? 0 : -1}
            onClick={handleClick}
            className={`fixed bottom-6 right-6 z-[90] flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg-card text-text-primary shadow-[0_12px_32px_rgba(0,0,0,0.22)] transition-opacity duration-300 hover:text-accent max-md:bottom-5 max-md:right-5 ${
              isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <svg
              viewBox="0 0 12 12"
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
            >
              <path
                d="M6 9V3M6 3 3.5 5.5M6 3l2.5 2.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="left"
            sideOffset={10}
            className="z-[95] rounded-full border border-border bg-[rgba(14,14,14,0.94)] px-3 py-1.5 text-[0.62rem] tracking-[0.16em] text-text-secondary shadow-[0_10px_24px_rgba(0,0,0,0.22)] backdrop-blur-md"
          >
            back to top
            <Tooltip.Arrow className="fill-[rgba(14,14,14,0.94)]" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
