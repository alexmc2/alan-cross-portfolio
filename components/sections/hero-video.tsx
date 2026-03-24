'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { onIdleChange, isPageIdle } from '@/lib/media-lifecycle';

const HERO_OFFSCREEN_DELAY_MS = 3000;
const HERO_REVEAL_DELAY_MS = 250;

type VimeoPlayerLike = {
  destroy: () => Promise<void>;
  off: (event: string, callback: () => void) => void;
  on: (event: string, callback: () => void) => void;
  pause: () => Promise<void>;
  play: () => Promise<void>;
  ready: () => Promise<void>;
};

type HeroVideoProps = {
  uploadedVideoUrl?: string;
  uploadedVideoMimeType?: string;
  externalMediaSrc?: string;
  externalMediaType?: 'iframe' | 'video';
  externalMediaMimeType?: string;
  posterSrc: string;
  title: string;
};

export default function HeroVideo({
  uploadedVideoUrl,
  uploadedVideoMimeType,
  externalMediaSrc,
  externalMediaType,
  externalMediaMimeType,
  posterSrc,
  title,
}: HeroVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const vimeoPlayerRef = useRef<VimeoPlayerLike | null>(null);
  const isInViewRef = useRef(true);
  const offscreenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isMediaVisible, setIsMediaVisible] = useState(false);

  const hasMedia = Boolean(uploadedVideoUrl || externalMediaSrc);
  const isVimeoEmbed =
    externalMediaType === 'iframe' &&
    Boolean(externalMediaSrc?.includes('player.vimeo.com'));

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
    }, HERO_REVEAL_DELAY_MS);
  }, [clearRevealTimer]);

  const attemptPlay = useCallback(() => {
    const nativeVideoPlay = videoRef.current?.play();
    nativeVideoPlay?.catch(() => {});

    const vimeoPlay = vimeoPlayerRef.current?.play();
    vimeoPlay?.catch(() => {});
  }, []);

  const pauseMedia = useCallback(() => {
    videoRef.current?.pause();
    const vimeoPause = vimeoPlayerRef.current?.pause();
    vimeoPause?.catch(() => {});
    hideMedia();
  }, [hideMedia]);

  useEffect(() => {
    if (!hasMedia) return;

    const node = containerRef.current;
    if (!node) return;

    if (!isPageIdle()) {
      setShouldLoad(true);
    }

    const unloadMedia = () => {
      pauseMedia();
      setShouldLoad(false);
    };

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
              attemptPlay();
            }
          } else {
            isInViewRef.current = false;
            pauseMedia();
            if (offscreenTimerRef.current) {
              clearTimeout(offscreenTimerRef.current);
            }
            offscreenTimerRef.current = setTimeout(() => {
              unloadMedia();
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
        unloadMedia();
      } else if (isInViewRef.current) {
        setShouldLoad(true);
        attemptPlay();
      }
    });

    return () => {
      observer.disconnect();
      unsubIdle();
      if (offscreenTimerRef.current) {
        clearTimeout(offscreenTimerRef.current);
        offscreenTimerRef.current = null;
      }
      if (revealTimerRef.current) {
        clearTimeout(revealTimerRef.current);
        revealTimerRef.current = null;
      }
    };
  }, [attemptPlay, hasMedia, pauseMedia]);

  useEffect(() => {
    if (!shouldLoad) {
      hideMedia();
      return;
    }

    attemptPlay();
  }, [attemptPlay, hideMedia, shouldLoad]);

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

  if (!hasMedia) {
    return (
      <div
        className="w-full h-full relative"
        style={{
          background:
            'linear-gradient(170deg, #1a1520, #0d1117 40%, #0a0f14 70%, #0a0a0a)',
        }}
      >
        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border px-8 py-4 font-body text-[0.75rem] tracking-[0.3em] uppercase opacity-50"
          style={{
            color: 'var(--color-hero-text-secondary)',
            borderColor: 'var(--color-hero-text-secondary)',
          }}
        >
          &#9654; Showreel plays here
        </span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-out ${
          isMediaVisible ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Image
          src={posterSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {shouldLoad ? (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            isMediaVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {uploadedVideoUrl ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
              onPlaying={scheduleReveal}
              onWaiting={hideMedia}
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
                onPlaying={scheduleReveal}
                onWaiting={hideMedia}
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
                ref={iframeRef}
                src={externalMediaSrc}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full border-0 pointer-events-none"
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
        </div>
      ) : null}

    </div>
  );
}
