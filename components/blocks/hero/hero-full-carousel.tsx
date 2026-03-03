// components/blocks/hero/hero-full-carousel.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';

type HeroCarouselImage = {
  _key?: string;
  alt?: string | null;
  asset?: {
    _id?: string | null;
    metadata?: {
      lqip?: string | null;
      dimensions?: {
        width?: number | null;
        height?: number | null;
      } | null;
    } | null;
  } | null;
} & Record<string, unknown>;

type HeroFullCarouselProps = {
  images: HeroCarouselImage[];
  autoAdvanceInterval?: number;
};

const DEFAULT_INTERVAL_MS = 12000;

export function HeroFullCarousel({
  images,
  autoAdvanceInterval = DEFAULT_INTERVAL_MS,
}: HeroFullCarouselProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [shouldAutoAdvance, setShouldAutoAdvance] = useState(true);
  const resumeTimeoutRef = useRef<number | null>(null);

  const carouselOptions = useMemo(
    () => ({
      loop: images.length > 1,
      align: 'start' as const,
      duration: 40,
    }),
    [images.length]
  );

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const handleSelect = () => {
      setActiveIndex(carouselApi.selectedScrollSnap());
    };

    handleSelect();
    carouselApi.on('select', handleSelect);
    carouselApi.on('reInit', handleSelect);

    return () => {
      carouselApi.off('select', handleSelect);
      carouselApi.off('reInit', handleSelect);
    };
  }, [carouselApi]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setShouldAutoAdvance(!mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);

    return () => {
      mediaQuery.removeEventListener('change', updatePreference);
    };
  }, []);

  useEffect(() => {
    if (!carouselApi || images.length <= 1 || !shouldAutoAdvance) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (!carouselApi) {
        return;
      }

      if (carouselApi.canScrollNext()) {
        carouselApi.scrollNext();
      } else {
        carouselApi.scrollTo(0);
      }
    }, autoAdvanceInterval);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [autoAdvanceInterval, carouselApi, images.length, shouldAutoAdvance]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        window.clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  if (images.length === 0) {
    return null;
  }

  const pauseAutoAdvance = () => {
    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
    }

    setShouldAutoAdvance(false);
    resumeTimeoutRef.current = window.setTimeout(() => {
      setShouldAutoAdvance(true);
    }, autoAdvanceInterval);
  };

  const handlePrev = () => {
    if (!carouselApi) return;
    pauseAutoAdvance();
    carouselApi.scrollPrev();
  };

  const handleNext = () => {
    if (!carouselApi) return;
    pauseAutoAdvance();
    if (carouselApi.canScrollNext()) {
      carouselApi.scrollNext();
    } else {
      carouselApi.scrollTo(0);
    }
  };

  return (
    <Carousel
      className="relative size-full"
      opts={carouselOptions}
      setApi={setCarouselApi}
    >
      <CarouselContent className="h-full !-ml-0">
        {images.map((carouselImage, index) => {
          const key =
            carouselImage?._key ||
            carouselImage?.asset?._id ||
            `hero-carousel-image-${index}`;
          const isActive = index === activeIndex;
          const dimensions = carouselImage?.asset?.metadata?.dimensions as
            | { width?: number | null; height?: number | null }
            | undefined;
          const maxWidth = Math.min(1600, Math.round(dimensions?.width ?? 1600));
          const imageSrc = urlFor(carouselImage)
            .width(maxWidth)
            .fit('max')
            .quality(70)
            .url();

          return (
            <CarouselItem className="h-full !pl-0" key={key}>
              <div
                className={cn(
                  'relative h-full w-full overflow-hidden will-change-transform motion-reduce:animate-none',
                  isActive ? 'animate-zoom-in' : 'animate-none'
                )}
              >
                <Image
                  src={imageSrc}
                  alt={carouselImage?.alt || ''}
                  fill
                  priority={index === 0}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  className="object-cover"
                  sizes="100vw"
                  placeholder={
                    carouselImage?.asset?.metadata?.lqip ? 'blur' : undefined
                  }
                  blurDataURL={
                    carouselImage?.asset?.metadata?.lqip || undefined
                  }
                />
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      {images.length > 1 && (
        <>
          <CarouselPrevious
            type="button"
            onClick={(event) => {
              event.preventDefault();
              handlePrev();
            }}
            className="left-6 top-1/2 -translate-y-1/2 z-30 cursor-pointer rounded-full border border-slate-600 bg-transparent text-slate-300 transition-all duration-300 ease-out delay-75 hover:bg-white/10 hover:text-white hover:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          />

          <CarouselNext
            type="button"
            onClick={(event) => {
              event.preventDefault();
              handleNext();
            }}
            className="right-6 top-1/2 -translate-y-1/2 z-30 cursor-pointer rounded-full border border-slate-600 bg-transparent text-slate-300 transition-all duration-300 ease-out delay-75 hover:bg-white/10 hover:text-white hover:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          />
        </>
      )}
    </Carousel>
  );
}
