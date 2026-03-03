"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-100 flex justify-between items-center border-b transition-all duration-400 ${
        scrolled
          ? "bg-[rgba(10,10,10,0.92)] backdrop-blur-[20px] py-4 px-12 border-[rgba(255,255,255,0.06)]"
          : "py-6 px-12 border-transparent"
      }`}
    >
      <Link
        href="/"
        className="font-display font-bold text-[1.25rem] tracking-[0.08em] uppercase text-text-primary no-underline"
      >
        Alan <span className=" text-white font-bold">X</span>
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

      {/* Mobile hamburger button */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <span
          className={`block w-5 h-px bg-text-primary transition-all duration-300 ${
            mobileOpen ? "rotate-45 translate-y-[4px]" : ""
          }`}
        />
        <span
          className={`block w-5 h-px bg-text-primary transition-all duration-300 ${
            mobileOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block w-5 h-px bg-text-primary transition-all duration-300 ${
            mobileOpen ? "-rotate-45 -translate-y-[4px]" : ""
          }`}
        />
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-[rgba(10,10,10,0.97)] backdrop-blur-[20px] border-b border-[rgba(255,255,255,0.06)] md:hidden">
          <ul className="flex flex-col p-6 gap-6 list-none">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-[0.85rem] font-normal tracking-[0.12em] uppercase text-text-secondary no-underline transition-colors duration-300 hover:text-text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
