'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';

type BlogCategoryFilterProps = {
  category?: string;
  visibleCategories: string[];
  extraCategories: string[];
  initiallyOpen: boolean;
};

function buildHref(params: { category?: string; page?: number }) {
  const sp = new URLSearchParams();
  if (params.category) sp.set('category', params.category);
  if (params.page && params.page > 1) sp.set('page', String(params.page));
  const qs = sp.toString();
  return qs ? `/blog?${qs}` : '/blog';
}

export default function BlogCategoryFilter({
  category,
  visibleCategories,
  extraCategories,
  initiallyOpen,
}: BlogCategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const morePanelId = useId();

  useEffect(() => {
    setIsOpen(initiallyOpen);
  }, [initiallyOpen]);

  return (
    <div className="hidden md:block mb-12">
      <div className="flex flex-wrap gap-3">
        <Link
          href="/blog"
          className={`shrink-0 text-[0.7rem] tracking-[0.15em] uppercase px-4 py-2 border transition-colors duration-300 no-underline whitespace-nowrap ${
            !category
              ? 'bg-accent text-bg-primary border-accent font-semibold'
              : 'border-accent/30 text-text-secondary hover:border-accent hover:text-accent'
          }`}
        >
          All
        </Link>

        {visibleCategories.map((cat) => (
          <Link
            key={cat}
            href={buildHref({ category: cat })}
            className={`shrink-0 text-[0.7rem] tracking-[0.15em] uppercase px-4 py-2 border transition-colors duration-300 no-underline whitespace-nowrap ${
              category === cat
                ? 'bg-accent text-bg-primary border-accent font-semibold'
                : 'border-accent/30 text-text-secondary hover:border-accent hover:text-accent'
            }`}
          >
            {cat}
          </Link>
        ))}

        {extraCategories.length > 0 && (
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls={morePanelId}
            onClick={() => setIsOpen((open) => !open)}
            className={`shrink-0 text-[0.7rem] tracking-[0.15em] uppercase px-4 py-2 border transition-colors duration-300 whitespace-nowrap ${
              isOpen
                ? 'border-accent text-accent'
                : 'border-accent/30 text-text-secondary hover:border-accent hover:text-accent'
            }`}
          >
            More
          </button>
        )}
      </div>

      {extraCategories.length > 0 && (
        <div
          className={`grid transition-[grid-template-rows] duration-200 ease-out ${
            isOpen ? '[grid-template-rows:1fr]' : '[grid-template-rows:0fr]'
          }`}
        >
          <div className="overflow-hidden">
            <div
              id={morePanelId}
              className={`flex flex-wrap gap-3 pt-3 transition-all duration-200 ease-out ${
                isOpen
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-1 pointer-events-none'
              }`}
            >
              {extraCategories.map((cat) => (
                <Link
                  key={cat}
                  href={buildHref({ category: cat })}
                  className={`shrink-0 text-[0.7rem] tracking-[0.15em] uppercase px-4 py-2 border transition-colors duration-300 no-underline whitespace-nowrap ${
                    category === cat
                      ? 'bg-accent text-bg-primary border-accent font-semibold'
                      : 'border-accent/30 text-text-secondary hover:border-accent hover:text-accent'
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
