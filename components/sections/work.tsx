'use client';

import { useState, useEffect, useRef } from 'react';
import type { PortfolioItem } from '@/types';
import { urlFor } from '@/sanity/lib/image';
import { resolveExternalMediaSource } from '@/lib/utils';
import Image from 'next/image';
import DeferredMediaFrame from './deferred-media-frame';

const MOBILE_VISIBLE_ITEMS = 4;
const STAGGER_MS = 120;

export default function Work({ items }: { items: PortfolioItem[] }) {
  const [visibleCount, setVisibleCount] = useState(MOBILE_VISIBLE_ITEMS);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasToggle = items.length > MOBILE_VISIBLE_ITEMS;
  const hasMoreItems = visibleCount < items.length;
  const total = items.length;
  const padTotal = String(total).padStart(2, '0');

  const handleToggle = () => {
    setVisibleCount((count) => {
      if (count < items.length) {
        return Math.min(count + MOBILE_VISIBLE_ITEMS, items.length);
      }
      const container = containerRef.current;
      if (container) {
        container.querySelectorAll('.work-enter').forEach((el, i) => {
          if (i >= MOBILE_VISIBLE_ITEMS) el.classList.remove('visible');
        });
      }
      return MOBILE_VISIBLE_ITEMS;
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const els = container.querySelectorAll<HTMLElement>(
      '.work-enter:not(.visible)',
    );
    if (!els.length) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries.filter((e) => e.isIntersecting);
        entering.forEach((entry, i) => {
          const delay = entering.length > 1 ? i * STAGGER_MS : 0;
          const id = setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          timeouts.push(id);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    els.forEach((el) => observer.observe(el));

    return () => {
      timeouts.forEach(clearTimeout);
      observer.disconnect();
    };
  }, [visibleCount]);

  return (
    <section id="work" className="py-28 px-12 max-md:py-20 max-md:px-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="slabel">Selected Work</div>
        <div ref={containerRef} id="work-grid" className="mt-12">
          {items.map((item, index) => {
            const isHiddenOnMobile = index >= visibleCount;
            const direction = index % 2 === 0 ? 'from-left' : 'from-right';
            const videoUrl = item.videoUrl || item.vimeoUrl || null;
            const uploadedVideoUrl = item.videoFile?.asset?.url || null;
            const uploadedVideoMimeType = item.videoFile?.asset?.mimeType;
            const externalMedia = videoUrl
              ? resolveExternalMediaSource(videoUrl)
              : null;
            const mediaSrc = uploadedVideoUrl || externalMedia?.src || null;
            const mediaType = uploadedVideoUrl
              ? 'video'
              : externalMedia?.mediaType;
            const mediaMimeType = uploadedVideoUrl
              ? uploadedVideoMimeType
              : externalMedia?.mimeType;
            const thumbnailUrl = item.thumbnail?.asset
              ? urlFor(item.thumbnail).width(1200).height(675).url()
              : null;
            const posterSrc = thumbnailUrl ?? externalMedia?.posterSrc ?? null;
            const destinationHref = uploadedVideoUrl || videoUrl || null;
            const padIndex = String(index + 1).padStart(2, '0');

            return (
              <div
                key={item._id}
                className={`work-enter ${direction} mb-20 max-[900px]:mb-12 ${
                  isHiddenOnMobile ? 'hidden' : ''
                }`}
              >
                {/* Video / Thumbnail — 16:9 */}
                <div className="group relative aspect-video rounded overflow-hidden bg-bg-card">
                  {mediaSrc ? (
                    <DeferredMediaFrame
                      mediaType={mediaType}
                      src={mediaSrc}
                      mimeType={mediaMimeType}
                      title={item.title}
                      fallbackLabel={item.category || 'Video'}
                      sizes="(max-width: 900px) 100vw, 1100px"
                      posterSrc={posterSrc ?? undefined}
                      posterBlurDataURL={item.thumbnail?.asset?.metadata?.lqip}
                    />
                  ) : thumbnailUrl ? (
                    <Image
                      src={thumbnailUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 900px) 100vw, 1100px"
                      placeholder={
                        item.thumbnail?.asset?.metadata?.lqip
                          ? 'blur'
                          : undefined
                      }
                      blurDataURL={item.thumbnail?.asset?.metadata?.lqip}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background: 'var(--gradient-surface-placeholder)',
                      }}
                    >
                      <span
                        className="border px-5 py-2.5 text-[0.65rem] tracking-[0.25em] uppercase text-text-muted"
                        style={{
                          borderColor: 'var(--color-muted-border-soft)',
                        }}
                      >
                        {item.category || 'Video'}
                      </span>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <a
                    href={destinationHref || '#'}
                    target={destinationHref ? '_blank' : undefined}
                    rel={destinationHref ? 'noopener noreferrer' : undefined}
                    className="absolute inset-x-0 bottom-0 z-10 flex cursor-pointer flex-col justify-end p-4 opacity-100 transition-opacity duration-400 md:inset-0 md:pointer-events-none md:p-8 md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:opacity-100"
                    style={{
                      color: 'var(--color-hero-text-primary)',
                      background:
                        'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 35%, transparent 100%)',
                    }}
                  >
                    <h3 className="mb-1 font-display text-base font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] md:mb-2 md:text-2xl">
                      {item.title}
                    </h3>
                    <p
                      className="line-clamp-2 text-xs tracking-[0.03em] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] md:text-base"
                      style={{ color: 'var(--color-hero-text-secondary)' }}
                    >
                      {item.description
                        ? item.description
                        : `${item.category || ''}${item.year ? ` \u2014 ${item.year}` : ''}`}
                    </p>
                  </a>
                </div>

                {/* Meta row: pill | title | divider | index */}
                <div className="flex items-center gap-4 mt-5 px-1 max-[900px]:flex-wrap max-[900px]:gap-2.5">
                  {item.category && (
                    <span
                      className="inline-block shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-[11px] font-medium tracking-[2px] uppercase text-accent"
                      style={{
                        borderColor: 'var(--color-accent-soft)',
                        backgroundColor: 'var(--color-accent-soft)',
                      }}
                    >
                      {item.category}
                    </span>
                  )}
                  {/* <h3 className="text-xl font-medium leading-tight max-[900px]:text-[17px]">
                    {destinationHref ? (
                      <a
                        href={destinationHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-primary no-underline transition-colors duration-300 hover:text-accent"
                      >
                        {item.title}
                      </a>
                    ) : (
                      item.title
                    )}
                  </h3> */}
                  <div className="flex-1 h-px bg-border min-w-10 max-[900px]:hidden" />
                  <span className="font-display text-xs tracking-[2px] text-text-muted whitespace-nowrap shrink-0">
                    {padIndex} / {padTotal}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {hasToggle ? (
          <button
            type="button"
            onClick={handleToggle}
            aria-expanded={!hasMoreItems}
            aria-controls="work-grid"
            className="mt-8 inline-flex items-center gap-2 bg-transparent p-0 text-[0.7rem] tracking-[0.2em] uppercase text-accent transition-opacity duration-300 hover:opacity-80"
          >
            <span>{hasMoreItems ? 'See more work' : 'See less work'}</span>
            <svg
              viewBox="0 0 12 12"
              aria-hidden="true"
              className={`h-3 w-3 transition-transform duration-300 ${
                hasMoreItems ? '' : 'rotate-180'
              }`}
              fill="none"
            >
              <path
                d="M2.5 4.5 6 8l3.5-3.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : null}
      </div>
    </section>
  );
}
