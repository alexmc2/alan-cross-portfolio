// components/blocks/hero/hero-1.tsx
import { Button } from '@/components/ui/button1';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { stegaClean } from 'next-sanity';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { FadeIn } from '@/components/ui/fade.in';
import { PAGE_QUERYResult } from '@/sanity.types';

type Hero1Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>[number],
  { _type: 'hero-1' }
>;

export default function Hero1({
  tagLine,
  title,
  body,
  image,
  links,
}: Hero1Props) {
  const dimensions = image?.asset?.metadata?.dimensions;
  const intrinsicWidth = Math.round(dimensions?.width ?? 1400);
  const targetWidth = Math.min(1280, Math.max(intrinsicWidth, 720));
  const aspectRatio =
    dimensions?.width && dimensions?.height
      ? dimensions.width / dimensions.height
      : undefined;
  const targetHeight = aspectRatio
    ? Math.round(targetWidth / aspectRatio)
    : undefined;

  let heroImageUrl: string | undefined;
  if (image?.asset?._id) {
    const heroImageBuilder = urlFor(image)
      .width(targetWidth)
      .fit('max')
      .quality(70);

    heroImageUrl = targetHeight
      ? heroImageBuilder.height(targetHeight).url()
      : heroImageBuilder.url();
  }

  return (
    <div className="container dark:bg-background py-20 lg:pt-40">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="flex flex-col justify-center">
          {tagLine && (
            <FadeIn as="h1" delay={120} className="leading-[0] font-sans">
              <span className="text-base font-semibold">{tagLine}</span>
            </FadeIn>
          )}
          {title && (
            <FadeIn
              as="h2"
              delay={220}
              className="mt-6 text-4xl font-bold leading-[1.1] md:text-5xl lg:text-6xl"
            >
              {title}
            </FadeIn>
          )}
          {body && (
            <FadeIn as="div" delay={320} className="mt-6 text-lg">
              <PortableTextRenderer value={body} />
            </FadeIn>
          )}
          {links && links.length > 0 && (
            <FadeIn delay={420} className="mt-10 flex flex-wrap gap-4" as="div">
              {links.map((link, index) => {
                const linkKey = link._key ?? `${link.href ?? 'cta'}-${index}`;
                const href = link.href ? stegaClean(link.href) : '#';
                const label = stegaClean(link.title) || 'Learn more';
                const target = link.target ? '_blank' : undefined;

                return (
                  <Button
                    key={linkKey}
                    variant={stegaClean(link?.buttonVariant)}
                    asChild
                  >
                    <Link
                      href={href}
                      target={target}
                      rel={target ? 'noopener noreferrer' : undefined}
                    >
                      {label}
                    </Link>
                  </Button>
                );
              })}
            </FadeIn>
          )}
        </div>
        <div className="flex flex-col justify-center">
          {image && image.asset?._id && heroImageUrl && (
            <FadeIn delay={520}>
              <Image
                className="rounded-xl"
                src={heroImageUrl}
                alt={image.alt || ''}
                width={targetWidth}
                height={targetHeight ?? dimensions?.height ?? 800}
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 42vw, 92vw"
                placeholder={image?.asset?.metadata?.lqip ? 'blur' : undefined}
                blurDataURL={image?.asset?.metadata?.lqip || ''}
              />
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  );
}
