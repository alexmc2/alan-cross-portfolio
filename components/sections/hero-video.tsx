'use client';

import { useEffect, useRef, useState } from 'react';
import { onIdleChange, isPageIdle } from '@/lib/media-lifecycle';

const HERO_OFFSCREEN_DELAY_MS = 3000;

type HeroVideoProps = {
  uploadedVideoUrl?: string;
  uploadedVideoMimeType?: string;
  externalMediaSrc?: string;
  externalMediaType?: 'iframe' | 'video';
  externalMediaMimeType?: string;
  title: string;
};

export default function HeroVideo({
  uploadedVideoUrl,
  uploadedVideoMimeType,
  externalMediaSrc,
  externalMediaType,
  externalMediaMimeType,
  title,
}: HeroVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(true);
  const isInViewRef = useRef(true);
  const offscreenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasMedia = Boolean(uploadedVideoUrl || externalMediaSrc);

  useEffect(() => {
    if (!hasMedia) return;
    const node = containerRef.current;
    if (!node) return;

    // IntersectionObserver — detect when hero scrolls out of view
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            isInViewRef.current = true;
            if (offscreenTimerRef.current) {
              clearTimeout(offscreenTimerRef.current);
              offscreenTimerRef.current = null;
            }
            if (!isPageIdle()) {
              setShouldLoad(true);
              videoRef.current?.play().catch(() => {});
            }
          } else {
            isInViewRef.current = false;
            videoRef.current?.pause();
            if (offscreenTimerRef.current) {
              clearTimeout(offscreenTimerRef.current);
            }
            offscreenTimerRef.current = setTimeout(() => {
              setShouldLoad(false);
              offscreenTimerRef.current = null;
            }, HERO_OFFSCREEN_DELAY_MS);
          }
        }
      },
      { threshold: 0.01 },
    );
    observer.observe(node);

    // Idle detection — unload when idle, reload when active
    const unsubIdle = onIdleChange((idle) => {
      if (idle) {
        videoRef.current?.pause();
        setShouldLoad(false);
      } else if (isInViewRef.current) {
        setShouldLoad(true);
        videoRef.current?.play().catch(() => {});
      }
    });

    return () => {
      observer.disconnect();
      unsubIdle();
      if (offscreenTimerRef.current) {
        clearTimeout(offscreenTimerRef.current);
        offscreenTimerRef.current = null;
      }
    };
  }, [hasMedia, uploadedVideoUrl, externalMediaSrc, externalMediaType]);

  if (!hasMedia) {
    return (
      <div
        className="w-full h-full relative"
        style={{
          background:
            'linear-gradient(170deg, #1a1520, #0d1117 40%, #0a0f14 70%, #0a0a0a)',
        }}
      >
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-body text-[0.75rem] tracking-[0.3em] uppercase text-text-muted border border-text-muted px-8 py-4 opacity-50">
          &#9654; Showreel plays here
        </span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {shouldLoad ? (
        uploadedVideoUrl ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          >
            <source
              src={uploadedVideoUrl}
              {...(uploadedVideoMimeType ? { type: uploadedVideoMimeType } : {})}
            />
          </video>
        ) : externalMediaSrc ? (
          externalMediaType === 'video' ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            >
              <source
                src={externalMediaSrc}
                {...(externalMediaMimeType
                  ? { type: externalMediaMimeType }
                  : {})}
              />
            </video>
          ) : (
            <iframe
              src={externalMediaSrc}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full border-0 pointer-events-none"
              allow="autoplay; fullscreen; encrypted-media"
              allowFullScreen
              title={title}
            />
          )
        ) : null
      ) : (
        <div
          className="w-full h-full"
          style={{
            background:
              'linear-gradient(170deg, #1a1520, #0d1117 40%, #0a0f14 70%, #0a0a0a)',
          }}
        />
      )}
    </div>
  );
}
