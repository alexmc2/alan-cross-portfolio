"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const FRAME_READY_DELAY_MS = 2500;
const UNLOAD_DELAY_MS = 90000;
const FRAME_ROOT_MARGIN = "1200px 0px";

type DeferredVimeoFrameProps = {
  src: string;
  title: string;
  sizes: string;
  fallbackLabel: string;
  posterSrc?: string;
  posterBlurDataURL?: string;
};

export default function DeferredVimeoFrame({
  src,
  title,
  sizes,
  fallbackLabel,
  posterSrc,
  posterBlurDataURL,
}: DeferredVimeoFrameProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isFrameReady, setIsFrameReady] = useState(false);
  const unloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (unloadTimerRef.current) {
              clearTimeout(unloadTimerRef.current);
              unloadTimerRef.current = null;
            }
            setShouldLoad(true);
          } else {
            if (unloadTimerRef.current) {
              clearTimeout(unloadTimerRef.current);
            }
            // Give brief scroll grace period so we don't thrash iframe mounts.
            unloadTimerRef.current = setTimeout(() => {
              setShouldLoad(false);
              setIsFrameReady(false);
              unloadTimerRef.current = null;
            }, UNLOAD_DELAY_MS);
          }
        }
      },
      { threshold: 0.01, rootMargin: FRAME_ROOT_MARGIN }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
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
            showPoster ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: "linear-gradient(135deg, #0b0b0d, #141418 50%, #0d0d0f)",
          }}
        >
          <Image
            src={posterSrc}
            alt={title}
            fill
            className="object-cover"
            sizes={sizes}
            placeholder={posterBlurDataURL ? "blur" : undefined}
            blurDataURL={posterBlurDataURL}
          />
        </div>
      ) : null}

      {shouldLoad ? (
        <iframe
          src={src}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full border-0 pointer-events-none"
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
          loading="lazy"
          title={title}
          onLoad={handleFrameLoad}
        />
      ) : null}

      {showFallback ? (
        <div
          className="absolute inset-0 z-[1] pointer-events-none w-full h-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #151318, #1a1816 50%, #12110f)",
          }}
        >
          <span className="text-[0.65rem] tracking-[0.25em] uppercase text-text-muted border border-[rgba(255,255,255,0.05)] px-5 py-2.5">
            {fallbackLabel}
          </span>
        </div>
      ) : null}
    </div>
  );
}
