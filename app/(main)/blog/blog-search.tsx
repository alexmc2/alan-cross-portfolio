'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';

export default function BlogSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get('search') ?? '');
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  function navigate(term: string) {
    const sp = new URLSearchParams(searchParams.toString());

    if (term) {
      sp.set('search', term);
    } else {
      sp.delete('search');
    }

    // Reset to page 1 on new search
    sp.delete('page');

    const qs = sp.toString();
    startTransition(() => {
      router.push(qs ? `/blog?${qs}` : '/blog');
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const term = e.target.value;
    setValue(term);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => navigate(term), 300);
  }

  function handleClear() {
    setValue('');
    navigate('');
  }

  return (
    <div className="relative">
      {/* Search icon */}
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
          clipRule="evenodd"
        />
      </svg>

      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search posts…"
        aria-label="Search blog posts"
        className={`
          w-full pl-9 pr-8 py-2
          bg-bg-card border border-accent/20
          text-[0.8rem] text-text-primary placeholder:text-text-muted
          tracking-wide
          outline-none
          transition-colors duration-300
          focus:border-accent/50
          ${isPending ? 'opacity-70' : ''}
        `}
      />

      {/* Clear button */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors duration-200"
        >
          <svg
            className="w-3.5 h-3.5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      )}
    </div>
  );
}
