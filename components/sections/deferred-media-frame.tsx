'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { onIdleChange, isPageIdle } from '@/lib/media-lifecycle';

const REVEAL_DELAY_MS = 250;
const UNLOAD_DELAY_MS = 8000;
const FRAME_ROOT_MARGIN = '300px 0px';

type VimeoPlayerLike = {
  destroy: () => Promise<void>;
  off: (event: string, callback: () => void) => void;
  on: (event: string, callback: () => void) => void;
  pause: () => Promise<void>;
  play: () => Promise<void>;
  ready: () => Promise<void>;
};

type DeferredMediaFrameProps = {
  mediaType?: 'iframe' | 'video';
  src: string;
  mimeType?: string;
  title: string;
  sizes: string;
  fallbackLabel: string;
  posterSrc?: string;
  posterBlurDataURL?: string;
  displayMode?: 'contain' | 'cover';
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
  displayMode = 'contain',
}: DeferredMediaFrameProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const vimeoPlayerRef = useRef<VimeoPlayerLike | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isMediaVisible, setIsMediaVisible] = useState(false);
  const unloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInViewRef = useRef(false);

  const isVimeoEmbed =
    mediaType === 'iframe' && src.includes('player.vimeo.com');

  const clearRevealTimer = useCallback(() => {
    if (revealTimerRef.current) {
      clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
  }, []);

  const hideMedia = useCallback(() => {
    clearRevealTimer();
    setIsMediaVisible(false);
  }, [clearRevealTimer]);

  const scheduleReveal = useCallback(() => {
    clearRevealTimer();
    revealTimerRef.current = setTimeout(() => {
      setIsMediaVisible(true);
      revealTimerRef.current = null;
    }, REVEAL_DELAY_MS);
  }, [clearRevealTimer]);

  // Intersection + idle lifecycle
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const unload = () => {
      hideMedia();
      setShouldLoad(false);
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
            videoRef.current?.play().catch(() => {});
          } else {
            isInViewRef.current = false;
            videoRef.current?.pause();
            hideMedia();
            if (unloadTimerRef.current) {
              clearTimeout(unloadTimerRef.current);
            }
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
      clearRevealTimer();
    };
  }, [clearRevealTimer, hideMedia]);

  // Vimeo Player SDK — reveal only when actually playing (mirrors hero-video)
  useEffect(() => {
    if (!shouldLoad || !isVimeoEmbed) return;

    const iframeNode = iframeRef.current;
    if (!iframeNode) return;

    let cancelled = false;
    let player: VimeoPlayerLike | null = null;

    const handlePlaying = () => {
      scheduleReveal();
    };

    const handleBufferStart = () => {
      hideMedia();
    };

    const handlePause = () => {
      hideMedia();
    };

    void (async () => {
      try {
        const { default: VimeoPlayer } = await import('@vimeo/player');
        if (cancelled || iframeNode !== iframeRef.current) return;

        player = new VimeoPlayer(iframeNode) as VimeoPlayerLike;
        vimeoPlayerRef.current = player;

        player.on('playing', handlePlaying);
        player.on('bufferstart', handleBufferStart);
        player.on('pause', handlePause);

        await player.ready();
        const playPromise = player.play();
        playPromise?.catch(() => {});
      } catch {
        hideMedia();
      }
    })();

    return () => {
      cancelled = true;

      if (vimeoPlayerRef.current === player) {
        vimeoPlayerRef.current = null;
      }

      if (!player) return;

      player.off('playing', handlePlaying);
      player.off('bufferstart', handleBufferStart);
      player.off('pause', handlePause);
      player.destroy().catch(() => {});
    };
  }, [hideMedia, isVimeoEmbed, scheduleReveal, shouldLoad]);

  const triggerLoad = () => {
    if (unloadTimerRef.current) {
      clearTimeout(unloadTimerRef.current);
      unloadTimerRef.current = null;
    }
    setShouldLoad(true);
  };

  const showPoster = Boolean(posterSrc) && !isMediaVisible;
  const showFallback = !posterSrc && !isMediaVisible;
  const mediaFitClass =
    displayMode === 'cover' ? 'object-cover' : 'object-contain';
  const containInsetClass =
    displayMode === 'contain'
      ? '-inset-px w-[calc(100%+2px)] h-[calc(100%+2px)]'
      : 'inset-0 w-full h-full';
  const iframeClassName =
    displayMode === 'cover'
      ? 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full border-0 pointer-events-none'
      : `absolute ${containInsetClass} border-0 pointer-events-none`;

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
          <div className={`absolute ${containInsetClass}`}>
            <Image
              src={posterSrc}
              alt={title}
              fill
              className={mediaFitClass}
              sizes={sizes}
              placeholder={posterBlurDataURL ? 'blur' : undefined}
              blurDataURL={posterBlurDataURL}
            />
          </div>
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
            className={`absolute pointer-events-none ${mediaFitClass} ${containInsetClass}`}
            onPlaying={scheduleReveal}
            onWaiting={hideMedia}
          >
            <source src={src} {...(mimeType ? { type: mimeType } : {})} />
          </video>
        ) : (
          <iframe
            ref={iframeRef}
            src={src}
            className={iframeClassName}
            allow="autoplay; fullscreen; encrypted-media"
            allowFullScreen
            loading="eager"
            title={title}
            onLoad={() => {
              if (!isVimeoEmbed) {
                scheduleReveal();
              }
            }}
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
