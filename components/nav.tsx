'use client';

import { useState, useEffect, type MouseEvent } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/theme-toggle';

export default function Nav({
  overlayOnMedia = false,
}: {
  overlayOnMedia?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const overlayMode = overlayOnMedia && !scrolled && !mobileOpen;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Hash links prefixed with "/" so they work from any page
  const navLinks = [
    { label: 'About', href: '/#about' },
    { label: 'Work', href: '/#work' },
    { label: 'Services', href: '/#services' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/#contact' },
  ];

  const handleBrandClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    setMobileOpen(false);
    window.location.assign('/');
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-100 flex justify-between items-center border-b transition-all duration-400 ${
          scrolled || mobileOpen
            ? 'py-4 px-12 max-md:px-6 backdrop-blur-[20px]'
            : 'py-6 px-12 max-md:px-6 border-transparent'
        }`}
        style={
          scrolled || mobileOpen
            ? {
                backgroundColor: 'var(--color-nav-surface)',
                borderColor: 'var(--color-border)',
              }
            : undefined
        }
      >
        <Link
          href="/"
          className={`font-display font-bold text-[1.25rem] tracking-[0.08em] uppercase no-underline transition-opacity duration-200 ${
            overlayMode
              ? 'text-[var(--color-hero-text-primary)] opacity-100'
              : 'text-[var(--color-brand)]'
          }`}
          onClick={handleBrandClick}
        >
          Alan X
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-10 list-none">
          {navLinks.map((link) => (
            <li key={link.label} className="flex items-center">
              <Link
                href={link.href}
                className={`group relative inline-flex h-5 items-center text-[0.8rem] leading-none font-normal tracking-[0.12em] uppercase no-underline transition-all duration-300 ${
                  overlayMode
                    ? 'text-[var(--color-hero-text-primary)] opacity-92 hover:opacity-100'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
          <li className="flex items-center">
            <ThemeToggle
              tone={overlayMode ? 'overlay' : 'theme'}
              className="h-5 w-5"
            />
          </li>
        </ul>

        {/* Mobile hamburger / close button */}
        <button
          className="md:hidden relative w-8 h-8 flex items-center justify-center"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <span
            className={`absolute w-5 h-px transition-all duration-300 origin-center ${
              mobileOpen ? 'rotate-45' : '-translate-y-[6px]'
            }`}
            style={{
              backgroundColor: overlayMode
                ? 'var(--color-hero-text-primary)'
                : 'var(--color-text-primary)',
            }}
          />
          <span
            className={`absolute w-5 h-px transition-all duration-300 ${
              mobileOpen ? 'opacity-0 scale-x-0' : ''
            }`}
            style={{
              backgroundColor: overlayMode
                ? 'var(--color-hero-text-primary)'
                : 'var(--color-text-primary)',
            }}
          />
          <span
            className={`absolute w-5 h-px transition-all duration-300 origin-center ${
              mobileOpen ? '-rotate-45' : 'translate-y-[6px]'
            }`}
            style={{
              backgroundColor: overlayMode
                ? 'var(--color-hero-text-primary)'
                : 'var(--color-text-primary)',
            }}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        aria-hidden={!mobileOpen}
        className={`fixed inset-0 z-99 bg-bg-primary pt-28 px-8 md:hidden transition-opacity duration-300 ease-in-out ${
          mobileOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <ul className="flex flex-col gap-8 list-none">
          {navLinks.map((link, i) => (
            <li
              key={link.label}
              className="transition-all duration-300 ease-out"
              style={{
                transitionDelay: mobileOpen ? `${i * 60}ms` : '0ms',
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? 'translateY(0)' : 'translateY(12px)',
              }}
            >
              <Link
                href={link.href}
                className="text-[1.05rem] font-normal tracking-[0.15em] uppercase text-text-secondary no-underline transition-colors duration-300 hover:text-text-primary"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li
            className="transition-all duration-300 ease-out"
            style={{
              transitionDelay: mobileOpen ? `${navLinks.length * 60}ms` : '0ms',
              opacity: mobileOpen ? 1 : 0,
              transform: mobileOpen ? 'translateY(0)' : 'translateY(12px)',
            }}
          >
            <ThemeToggle
              showLabel
              className="text-[1.05rem] font-normal tracking-[0.15em] uppercase"
              onToggle={() => setMobileOpen(false)}
            />
          </li>
        </ul>
      </div>
    </>
  );
}
