// components/header/header-client.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import DesktopNav from '@/components/header/desktop-nav';
import MobileNav from '@/components/header/mobile-nav';
import { ModeToggle } from '@/components/menu-toggle';
import { cn } from '@/lib/utils';
import { NAVIGATION_QUERYResult, SETTINGS_QUERYResult } from '@/sanity.types';
import Logo from '@/components/logo';

type HeaderClientProps = {
  navigation: NAVIGATION_QUERYResult;
  settings: SETTINGS_QUERYResult;
};

export default function HeaderClient({
  navigation,
  settings,
}: HeaderClientProps) {
  const pathname = usePathname();

  const [overHero, setOverHero] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroPrefersSolidHeader, setHeroPrefersSolidHeader] = useState(false);

  // Avoid forcing theme on first paint to keep main thread idle

  const onHome = pathname === '/';
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const setHeaderHeightVar = () => {
      const headerHeight = headerRef.current?.offsetHeight ?? 0;

      if (headerHeight > 0) {
        root.style.setProperty('--header-height', `${headerHeight}px`);
      } else {
        root.style.removeProperty('--header-height');
      }
    };

    setHeaderHeightVar();

    if (!onHome) {
      setOverHero(false);
      setScrolled(true);
      setHeroPrefersSolidHeader(false);
      return () => {
        root.style.removeProperty('--header-height');
      };
    }

    const heroEl =
      document.getElementById('hero') ||
      (document.querySelector('[data-hero]') as HTMLElement | null);

    const readPrefersSolid = () =>
      heroEl?.dataset.headerInitiallyVisible === 'true';

    let prefersSolid = readPrefersSolid();
    setHeroPrefersSolidHeader(Boolean(prefersSolid));

    const BUFFER = 64; // flip solid slightly before hero ends
    let raf = 0;

    const update = () => {
      raf = 0;
      setHeaderHeightVar();
      setScrolled(window.scrollY > 8); // tiny scroll → frosted

      const currentPrefersSolid = readPrefersSolid();
      if (currentPrefersSolid !== prefersSolid) {
        prefersSolid = currentPrefersSolid;
        setHeroPrefersSolidHeader(Boolean(currentPrefersSolid));
      }

      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        const headerH = headerRef.current?.offsetHeight ?? 96;
        const isOver =
          rect.bottom > headerH + BUFFER && rect.top < window.innerHeight;
        setOverHero(isOver);
      } else {
        setOverHero(false);
      }
    };

    const onScrollOrResize = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    const observers: ResizeObserver[] = [];

    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(onScrollOrResize);
      observers.push(resizeObserver);

      if (heroEl) resizeObserver.observe(heroEl);
      if (headerRef.current) resizeObserver.observe(headerRef.current);
    }

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      observers.forEach((observer) => observer.disconnect());
      if (raf) cancelAnimationFrame(raf);
      root.style.removeProperty('--header-height');
    };
  }, [onHome]);

  const isOverHero = onHome && overHero;
  const navIsSolid = heroPrefersSolidHeader || !isOverHero;

  const transparentClass =
    'border-transparent bg-transparent';
  const frostedClass =
    'border-transparent bg-background/10 supports-[backdrop-filter]:backdrop-blur-md';
  const solidClass =
    'border-white/10 bg-background shadow-xs supports-[backdrop-filter]:backdrop-blur';

  // Transparent at top, frosted when scrolling over hero, solid elsewhere
  const headerClass = isOverHero
    ? heroPrefersSolidHeader
      ? solidClass
      : scrolled
        ? frostedClass
        : transparentClass
    : solidClass;

  const textClass = navIsSolid ? 'text-foreground' : 'text-white';

  const modeToggleClass = cn(
    'transition-colors duration-300',
    navIsSolid
      ? 'text-foreground hover:text-foreground'
      : 'text-white/90 hover:text-white'
  );

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'fixed inset-x-0 top-0 z-50 w-full border-b transition-all duration-500',
          headerClass
        )}
      >
        <div
          className={cn(
            'container flex min-h-[3.5rem] items-center justify-between gap-6 py-3 sm:py-3 transition-colors duration-500',
            textClass
          )}
        >
          <Link
            href="/"
            prefetch={false}
            aria-label="Home page"
            className="flex items-center gap-3 transition-transform duration-300 hover:scale-[1.01]"
          >
            <Logo
              settings={settings}
              variant="header"
              className="max-h-8 w-auto sm:max-h-10"
              sizes="(min-width: 1280px) 160px, (min-width: 640px) 120px, 96px"
              priority
              fetchPriority="high"
              loading="eager"
              alt=""
              ariaHidden
            />
            <span className="sr-only">
              {settings?.siteName || 'Sanity Next.js Website home'}
            </span>
          </Link>

          <div className="hidden items-center gap-6 xl:flex">
            <DesktopNav
              navigation={navigation}
              isSolid={navIsSolid}
            />
            <ModeToggle className={modeToggleClass} />
          </div>

          <div
            className={cn(
              'flex items-center gap-2 xl:hidden',
              textClass
            )}
          >
            <ModeToggle className={modeToggleClass} />
            <MobileNav
              navigation={navigation}
              settings={settings}
              isSolid={navIsSolid}
            />
          </div>
        </div>
      </header>

      {/* Spacer so content doesn’t jump under fixed header */}
      <div
        aria-hidden
        className="w-full"
        style={{ height: 'var(--header-height, 5.5rem)' }}
      />
    </>
  );
}
