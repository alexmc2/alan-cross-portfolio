'use client';

import { useState } from 'react';
import type { PortfolioItem } from '@/types';
import { urlFor } from '@/sanity/lib/image';
import { resolveExternalMediaSource } from '@/lib/utils';
import Image from 'next/image';
import DeferredMediaFrame from './deferred-media-frame';

const MOBILE_VISIBLE_ITEMS = 5;

export default function Work({ items }: { items: PortfolioItem[] }) {
  const [visibleCount, setVisibleCount] = useState(MOBILE_VISIBLE_ITEMS);
  const [animatedRange, setAnimatedRange] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const hasToggle = items.length > MOBILE_VISIBLE_ITEMS;
  const hasMoreItems = visibleCount < items.length;

  const handleToggle = () => {
    setVisibleCount((count) => {
      if (count < items.length) {
        const nextCount = Math.min(count + MOBILE_VISIBLE_ITEMS, items.length);
        setAnimatedRange({ start: count, end: nextCount });
        return nextCount;
      }

      setAnimatedRange(null);
      return MOBILE_VISIBLE_ITEMS;
    });
  };

  return (
    <section id="work" className="py-28 px-12 max-md:py-20 max-md:px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="slabel">Selected Work</div>
        <div
          id="work-grid"
          className="grid grid-cols-2 gap-6 mt-12 max-[900px]:grid-cols-1"
        >
          {items.map((item, index) => {
            const isHiddenOnMobile = index >= visibleCount;
            const isNewlyVisible =
              animatedRange &&
              index >= animatedRange.start &&
              index < animatedRange.end &&
              !isHiddenOnMobile;
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
              ? urlFor(item.thumbnail)
                  .width(1200)
                  .height(item.featured ? 514 : 675)
                  .url()
              : null;
            const posterSrc = thumbnailUrl ?? externalMedia?.posterSrc ?? null;
            const destinationHref = uploadedVideoUrl || videoUrl || '#';
            const imageSizes = item.featured ? '1200px' : '600px';

            return (
              <div
                key={item._id}
                className={`relative overflow-hidden group ${
                  item.featured
                    ? 'col-span-2 aspect-[21/9] max-[900px]:col-span-1 max-[900px]:aspect-video'
                    : 'aspect-video'
                } ${isHiddenOnMobile ? 'max-[900px]:hidden' : ''} ${
                  isNewlyVisible ? 'max-[900px]:animate-fade-up' : ''
                }`}
                style={{
                  background: 'var(--color-bg-card)',
                  animationDelay: isNewlyVisible
                    ? `${(index - animatedRange.start) * 90}ms`
                    : undefined,
                }}
              >
                {/* Video / Thumbnail / Placeholder */}
                <div className="w-full h-full">
                  {mediaSrc ? (
                    <DeferredMediaFrame
                      mediaType={mediaType}
                      src={mediaSrc}
                      mimeType={mediaMimeType}
                      title={item.title}
                      fallbackLabel={item.category || 'Video'}
                      sizes={imageSizes}
                      posterSrc={posterSrc ?? undefined}
                      posterBlurDataURL={item.thumbnail?.asset?.metadata?.lqip}
                    />
                  ) : thumbnailUrl ? (
                    <Image
                      src={thumbnailUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes={imageSizes}
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
                        background:
                          'linear-gradient(135deg, #151318, #1a1816 50%, #12110f)',
                      }}
                    >
                      <span className="text-[0.65rem] tracking-[0.25em] uppercase text-text-muted border border-[rgba(255,255,255,0.05)] px-5 py-2.5">
                        {item.category || 'Video'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Hover overlay */}
                <a
                  href={destinationHref}
                  target={destinationHref !== '#' ? '_blank' : undefined}
                  rel={destinationHref !== '#' ? 'noopener noreferrer' : undefined}
                  className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-4 opacity-100 md:inset-0 md:p-8 md:opacity-0 transition-opacity duration-400 md:group-hover:opacity-100 z-10 pointer-events-auto md:pointer-events-none md:group-hover:pointer-events-auto"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 35%, transparent 100%)',
                  }}
                >
                  <h3 className="font-display text-base md:text-2xl font-semibold mb-1 md:mb-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-base text-white/80 tracking-[0.03em] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] line-clamp-2">
                    {item.description
                      ? item.description
                      : `${item.category || ''}${item.year ? ` \u2014 ${item.year}` : ''}`}
                  </p>
                </a>
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
            className="mt-8 hidden max-[900px]:inline-flex items-center gap-2 bg-transparent p-0 text-[0.7rem] tracking-[0.2em] uppercase text-accent transition-opacity duration-300 hover:opacity-80"
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
