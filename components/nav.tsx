'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Hash links prefixed with "/" so they work from any page
  const navLinks = [
    { label: 'Work', href: '/#work' },
    { label: 'About', href: '/#about' },
    { label: 'Services', href: '/#services' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-100 flex justify-between items-center border-b transition-all duration-400 ${
          scrolled || mobileOpen
            ? 'bg-[rgba(10,10,10,0.95)] backdrop-blur-[20px] py-4 px-12 max-md:px-6 border-[rgba(255,255,255,0.06)]'
            : 'py-6 px-12 max-md:px-6 border-transparent'
        }`}
      >
        <Link
          href="/"
          className="font-display font-bold text-[1.25rem] tracking-[0.08em] uppercase text-text-primary no-underline"
        >
          Alan <span className="text-white font-bold">X</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex gap-10 list-none">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-[0.8rem] font-normal tracking-[0.12em] uppercase text-text-secondary no-underline transition-colors duration-300 relative hover:text-text-primary group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
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
            className={`absolute w-5 h-px bg-text-primary transition-all duration-300 origin-center ${
              mobileOpen ? 'rotate-45' : '-translate-y-[6px]'
            }`}
          />
          <span
            className={`absolute w-5 h-px bg-text-primary transition-all duration-300 ${
              mobileOpen ? 'opacity-0 scale-x-0' : ''
            }`}
          />
          <span
            className={`absolute w-5 h-px bg-text-primary transition-all duration-300 origin-center ${
              mobileOpen ? '-rotate-45' : 'translate-y-[6px]'
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu — full-screen dark overlay */}
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
        </ul>
      </div>
    </>
  );
}
