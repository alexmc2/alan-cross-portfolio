// components/blocks/hero/hero-full.tsx
import type { CSSProperties } from 'react';

import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { FadeIn } from '@/components/ui/fade.in';
import { cn } from '@/lib/utils';
import { HeroFullCarousel } from './hero-full-carousel';

type HeroFullProps = {
  tagLine?: string | null;
  title?: string | null;
  body?: any;
  image?: any;
  images?: any[] | null;
  height?: 'screen' | '70vh' | '60vh' | null;
  overlay?: boolean | null;
  frosted?: boolean | null;
  overlayStrength?: number | null;
  contentAlignment?: 'left' | 'center' | 'right' | null;
  initialHeaderVisible?: boolean | null;
};

export default function HeroFull({
  tagLine,
  title,
  body,
  image,
  images,
  height = 'screen',
  overlay = true,
  frosted = true,
  overlayStrength = 50,
  contentAlignment = 'center',
  initialHeaderVisible = false,
}: HeroFullProps) {
  const isFullScreen = !height || height === 'screen';
  const resolvedMinHeight = !isFullScreen ? height || '60vh' : undefined;
  const overlayOpacity = Math.max(0, Math.min(100, overlayStrength || 0)) / 100;
  const justify =
    contentAlignment === 'left'
      ? 'lg:justify-start'
      : contentAlignment === 'right'
        ? 'justify-end'
        : 'justify-center';
  const textAlign =
    contentAlignment === 'left'
      ? 'text-center lg:text-left'
      : contentAlignment === 'right'
        ? 'text-center lg:text-right'
        : 'text-center';
  const cardClasses = cn(
    frosted && 'hero-blur',
    'w-full text-white sm:w-auto',
    'max-w-2xl sm:max-w-3xl',
    textAlign
  );

  const heroImages = (
    images && images.length ? images : image ? [image] : []
  ).filter((img) => img?.asset?._id);

  const buildHeroImageUrl = (img: (typeof heroImages)[number]) => {
    if (!img?.asset?._id) {
      return undefined;
    }

    const dimensions = img.asset?.metadata?.dimensions;
    const maxWidth = Math.min(1600, Math.round(dimensions?.width ?? 1600));

    return urlFor(img).width(maxWidth).fit('max').quality(70).url();
  };

  const primaryHeroImage = heroImages[0];
  const primaryHeroImageUrl = primaryHeroImage
    ? buildHeroImageUrl(primaryHeroImage)
    : undefined;

  const headerHeightVar = 'var(--header-height, 5.5rem)';
  const heroStyle: CSSProperties = {
    marginTop: `calc(${headerHeightVar} * -1)`,
    minHeight: isFullScreen
      ? `calc(100vh + ${headerHeightVar})`
      : `calc(${resolvedMinHeight ?? '60vh'} + ${headerHeightVar})`,
  };

  return (
    <section
      id="hero" // ← add this here
      data-hero
      data-header-initially-visible={
        initialHeaderVisible ? 'true' : undefined
      }
      className={cn(
        'relative w-full overflow-hidden'
      )}
      style={heroStyle}
    >
      {(heroImages.length > 0 || overlay) && (
        <div className="absolute inset-0">
          {heroImages.length > 1 ? (
            <HeroFullCarousel images={heroImages} />
          ) : (
            primaryHeroImage &&
            primaryHeroImageUrl && (
              <div className="relative h-full w-full overflow-hidden animate-zoom-in will-change-transform motion-reduce:animate-none">
                <Image
                  src={primaryHeroImageUrl}
                  alt={primaryHeroImage.alt || ''}
                  fill
                  priority
                  fetchPriority="high"
                  className="object-cover"
                  sizes="100vw"
                  placeholder={
                    primaryHeroImage?.asset?.metadata?.lqip ? 'blur' : undefined
                  }
                  blurDataURL={
                    primaryHeroImage?.asset?.metadata?.lqip || undefined
                  }
                />
              </div>
            )
          )}
          {overlay && (
            <div
              className="pointer-events-none absolute inset-0 z-10"
              style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
            />
          )}
        </div>
      )}
      {(tagLine || title || body) && (
        <div
          className={cn(
            'absolute inset-0 z-20 flex px-6 pt-56 pb-16 sm:pt-32 lg:px-32',
            'items-start lg:items-center lg:pt-0 lg:pb-0',
            justify
          )}
        >
          <div className={cardClasses}>
            {tagLine && (
              <FadeIn
                as="p"
                delay={120}
                className="text-sm font-semibold tracking-wide opacity-90"
              >
                {tagLine}
              </FadeIn>
            )}
            {title && (
              <FadeIn as="h1" delay={200} className=" text-4.5xl md:text-7xl">
                {title}
              </FadeIn>
            )}
            {body && (
              <FadeIn
                as="div"
                delay={260}
                className=" sm:text-3xl text-2xl pt-2"
              >
                <PortableTextRenderer value={body} />
              </FadeIn>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
