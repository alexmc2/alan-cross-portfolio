'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { onIdleChange, isPageIdle } from '@/lib/media-lifecycle';

const FRAME_READY_DELAY_MS = 2500;
const UNLOAD_DELAY_MS = 8000;
const FRAME_ROOT_MARGIN = '300px 0px';

type DeferredMediaFrameProps = {
  mediaType?: 'iframe' | 'video';
  src: string;
  mimeType?: string;
  title: string;
  sizes: string;
  fallbackLabel: string;
  posterSrc?: string;
  posterBlurDataURL?: string;
};

export default function DeferredMediaFrame({
  mediaType = 'iframe',
  src,
  mimeType,
  title,
  sizes,
  fallbackLabel,
  posterSrc,
  posterBlurDataURL,
}: DeferredMediaFrameProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isFrameReady, setIsFrameReady] = useState(false);
  const unloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInViewRef = useRef(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const unload = () => {
      if (readyTimerRef.current) {
        clearTimeout(readyTimerRef.current);
        readyTimerRef.current = null;
      }
      setShouldLoad(false);
      setIsFrameReady(false);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            isInViewRef.current = true;
            if (unloadTimerRef.current) {
              clearTimeout(unloadTimerRef.current);
              unloadTimerRef.current = null;
            }
            if (!isPageIdle()) {
              setShouldLoad(true);
            }
            // Resume a paused video when it re-enters the viewport
            videoRef.current?.play().catch(() => {});
          } else {
            isInViewRef.current = false;
            // Immediately pause video when offscreen
            videoRef.current?.pause();
            if (unloadTimerRef.current) {
              clearTimeout(unloadTimerRef.current);
            }
            // Grace period before unloading to avoid thrash on quick scrolling
            unloadTimerRef.current = setTimeout(() => {
              unload();
              unloadTimerRef.current = null;
            }, UNLOAD_DELAY_MS);
          }
        }
      },
      { threshold: 0.01, rootMargin: FRAME_ROOT_MARGIN },
    );

    observer.observe(node);

    // Idle detection — unload when idle, reload when active
    const unsubIdle = onIdleChange((idle) => {
      if (idle) {
        videoRef.current?.pause();
        unload();
      } else if (isInViewRef.current) {
        setShouldLoad(true);
        videoRef.current?.play().catch(() => {});
      }
    });

    return () => {
      observer.disconnect();
      unsubIdle();
      if (unloadTimerRef.current) {
        clearTimeout(unloadTimerRef.current);
        unloadTimerRef.current = null;
      }
      if (readyTimerRef.current) {
        clearTimeout(readyTimerRef.current);
        readyTimerRef.current = null;
      }
    };
  }, []);

  const triggerLoad = () => {
    if (unloadTimerRef.current) {
      clearTimeout(unloadTimerRef.current);
      unloadTimerRef.current = null;
    }
    setShouldLoad(true);
  };

  const handleFrameLoad = () => {
    if (readyTimerRef.current) {
      clearTimeout(readyTimerRef.current);
    }
    // Keep poster a touch longer to avoid showing Vimeo's loading spinner.
    readyTimerRef.current = setTimeout(() => {
      setIsFrameReady(true);
      readyTimerRef.current = null;
    }, FRAME_READY_DELAY_MS);
  };

  const showPoster = Boolean(posterSrc) && (!shouldLoad || !isFrameReady);
  const showFallback = !posterSrc && (!shouldLoad || !isFrameReady);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      onMouseEnter={triggerLoad}
      onTouchStart={triggerLoad}
    >
      {posterSrc ? (
        <div
          className={`absolute inset-0 z-[1] pointer-events-none transition-opacity duration-500 ${
            showPoster ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: 'var(--gradient-surface-poster)',
          }}
        >
          <Image
            src={posterSrc}
            alt={title}
            fill
            className="object-cover"
            sizes={sizes}
            placeholder={posterBlurDataURL ? 'blur' : undefined}
            blurDataURL={posterBlurDataURL}
          />
        </div>
      ) : null}

      {shouldLoad ? (
        mediaType === 'video' ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            onLoadedData={handleFrameLoad}
          >
            <source src={src} {...(mimeType ? { type: mimeType } : {})} />
          </video>
        ) : (
          <iframe
            src={src}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full border-0 pointer-events-none"
            allow="autoplay; fullscreen; encrypted-media"
            allowFullScreen
            loading="eager"
            title={title}
            onLoad={handleFrameLoad}
          />
        )
      ) : null}

      {showFallback ? (
        <div
          className="absolute inset-0 z-[1] pointer-events-none w-full h-full flex items-center justify-center"
          style={{
            background: 'var(--gradient-surface-placeholder)',
          }}
        >
          <span
            className="border px-5 py-2.5 text-[0.65rem] tracking-[0.25em] uppercase text-text-muted"
            style={{ borderColor: 'var(--color-muted-border-soft)' }}
          >
            {fallbackLabel}
          </span>
        </div>
      ) : null}
    </div>
  );
}
