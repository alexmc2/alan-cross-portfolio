// app/about/components/demo-carousel.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import { cn } from '@/lib/utils';

export type DemoCarouselImage = {
  src: string;
  darkSrc?: string;
  alt?: string;
};

type DemoCarouselProps = {
  images: DemoCarouselImage[];
  interval?: number;
};

const AUTOPLAY_FALLBACK_INTERVAL = 5000;

export default function DemoCarousel({
  images,
  interval = AUTOPLAY_FALLBACK_INTERVAL,
}: DemoCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!api || images.length <= 1 || interval <= 0) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (mediaQuery.matches) return;

    const id = window.setInterval(() => {
      if (!api) return;

      if (api.canScrollNext()) {
        api.scrollNext();
        return;
      }

      api.scrollTo(0);
    }, interval);

    const handleMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        window.clearInterval(id);
      }
    };

    const supportsEventListener =
      typeof mediaQuery.addEventListener === 'function';

    if (supportsEventListener) {
      mediaQuery.addEventListener('change', handleMotionChange);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleMotionChange);
    }

    return () => {
      window.clearInterval(id);
      if (supportsEventListener) {
        mediaQuery.removeEventListener('change', handleMotionChange);
      } else if (typeof mediaQuery.removeListener === 'function') {
        mediaQuery.removeListener(handleMotionChange);
      }
    };
  }, [api, images.length, interval]);

  return (
    <Carousel
      className={cn('relative mx-auto w-full pb-16')}
      opts={{ align: 'start', loop: true }}
      setApi={setApi}
    >
      <CarouselContent>
        {images.map(({ src, darkSrc, alt }, index) => {
          const isDark = mounted && resolvedTheme === 'dark';
          const displaySrc = isDark && darkSrc ? darkSrc : src;

          return (
            <CarouselItem key={src}>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-primary-2/20 bg-white/80 shadow-sm backdrop-blur dark:border-primary-2/30 dark:bg-neutral-900/80">
                <Image
                  src={displaySrc}
                  alt={alt ?? 'Carousel image'}
                  fill
                  sizes="(min-width: 1024px) 44rem, 100vw"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      {images.length > 1 && (
        <>
          <CarouselPrevious
            className="hidden sm:flex"
            aria-label="Previous image"
          />
          <CarouselNext className="hidden sm:flex" aria-label="Next image" />
          <CarouselDots className="!static mt-6 sm:mt-8" />
        </>
      )}
    </Carousel>
  );
}
