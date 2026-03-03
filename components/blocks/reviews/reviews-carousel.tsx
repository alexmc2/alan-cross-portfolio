// components/blocks/reviews/reviews-carousel.tsx
import SectionContainer from '@/components/ui/section-container';
import { stegaClean } from 'next-sanity';
import { fetchGoogleReviews } from '@/lib/google/reviews';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from '@/components/ui/carousel';
import { StarRating } from '@/components/ui/star-rating';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button1';
import { FadeIn } from '@/components/ui/fade.in';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { PAGE_QUERYResult } from '@/sanity.types';
import type { ReviewsSortOrder } from '@/lib/google/reviews';

const INDICATOR_MIN_ITEMS = 2;

const MINIMUM_RATING_MAP: Record<string, number> = {
  any: 0,
  '3': 3,
  '4': 4,
  '5': 5,
};

const SORT_ORDER_MAP: Record<string, ReviewsSortOrder> = {
  most_relevant: 'most_relevant',
  newest: 'newest',
};

type PageBlock = NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>[number];
export type ReviewsCarouselBlock = Extract<
  PageBlock,
  { _type: 'reviews-carousel' }
>;
type ReviewsCarouselLink = NonNullable<ReviewsCarouselBlock['cta']>;

function resolveMinimumRating(raw?: string | null): number | null {
  if (!raw) return null;
  const cleaned = stegaClean(raw);
  const value = MINIMUM_RATING_MAP[cleaned] ?? Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

function resolveSortOrder(raw?: string | null): ReviewsSortOrder {
  if (!raw) return 'most_relevant';
  const cleaned = stegaClean(raw);
  return SORT_ORDER_MAP[cleaned] ?? 'most_relevant';
}

function ReviewCard({
  authorName,
  rating,
  body,
  relativeTime,
  avatarUrl,
}: {
  authorName: string;
  rating: number;
  body?: string;
  relativeTime?: string;
  avatarUrl?: string;
}) {
  const displayInitials = authorName
    .split(' ')
    .map((segment) => segment[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <article className="flex h-full min-h-[320px] flex-col gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm md:min-h-[360px]">
      <header className="flex items-center gap-3 text-left">
        <Avatar className="size-12 bg-muted">
          {avatarUrl ? (
            <AvatarImage
              src={avatarUrl}
              alt={`${authorName} profile picture`}
              referrerPolicy="no-referrer"
            />
          ) : null}
          <AvatarFallback>{displayInitials || 'GG'}</AvatarFallback>
        </Avatar>
        <div className="space-y-0.5">
          <p className="font-medium text-foreground">{authorName}</p>
          {relativeTime ? (
            <p className="text-sm text-muted-foreground">{relativeTime}</p>
          ) : null}
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 text-left">
        <StarRating rating={rating} />
        {body ? (
          <p className="line-clamp-6 whitespace-pre-line text-base leading-relaxed text-muted-foreground md:line-clamp-8">
            {body}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export default async function ReviewsCarousel(block: ReviewsCarouselBlock) {
  const color = block.colorVariant ? stegaClean(block.colorVariant) : null;
  const padding = block.padding ?? null;
  const sectionId = block.sectionId ? stegaClean(block.sectionId) : null;
  const eyebrow = block.eyebrow ? stegaClean(block.eyebrow) : null;
  const heading = block.heading ? stegaClean(block.heading) : null;
  const intro = block.intro ? stegaClean(block.intro) : null;
  const placeId = block.placeId ? stegaClean(block.placeId) : null;
  const languageCode = block.languageCode
    ? stegaClean(block.languageCode)
    : null;

  const limit = block.maximumReviews ?? undefined;
  const minimumRating = resolveMinimumRating(block.minimumRating);
  const sortOrder = resolveSortOrder(block.sortOrder);

  const { reviews, averageRating, userRatingCount, placeName, error } =
    await fetchGoogleReviews({
      placeId,
      limit,
      minimumRating,
      sortOrder,
      languageCode,
    });

  const cta = block.cta ?? null;
  const ctaHref = cta?.href ? stegaClean(cta.href) : null;
  const ctaLabel = cta?.title ? stegaClean(cta.title) : null;
  const ctaTarget = cta?.target ? '_blank' : undefined;
  const buttonVariant = cta?.buttonVariant
    ? (stegaClean(cta.buttonVariant) as ReviewsCarouselLink['buttonVariant'])
    : 'default';

  const hasCarousel = reviews.length > 0;

  return (
    <SectionContainer
      color={color}
      padding={padding}
      id={sectionId}
      className="py-16 lg:py-24"
    >
      <FadeIn
        as="div"
        delay={120}
        className="mx-auto flex max-w-5xl flex-col gap-12 text-center"
      >
        <div className="space-y-6">
          {eyebrow ? (
            <FadeIn
              as="p"
              delay={160}
              className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground"
            >
              {eyebrow}
            </FadeIn>
          ) : null}

          {heading ? (
            <FadeIn
              as="h2"
              delay={200}
              className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              {heading}
            </FadeIn>
          ) : null}

          <FadeIn
            delay={240}
            className="flex flex-col items-center gap-4 text-muted-foreground"
          >
            {typeof averageRating === 'number' && averageRating > 0 ? (
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center justify-center gap-4">
                  <StarRating rating={averageRating} size="lg" />
                  <span className="text-3xl font-semibold leading-none text-foreground">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm">
                  {userRatingCount
                    ? `${userRatingCount} Google reviews`
                    : 'Google reviews'}
                  {placeName ? ` · ${placeName}` : null}
                </p>
              </div>
            ) : null}
            {intro ? (
              <p className="max-w-2xl text-base leading-relaxed">{intro}</p>
            ) : null}
          </FadeIn>
        </div>

        {error ? (
          <FadeIn
            as="p"
            delay={320}
            className="mx-auto max-w-xl rounded-2xl bg-destructive/5 p-6 text-sm text-destructive"
          >
            {error}
          </FadeIn>
        ) : null}

        {hasCarousel ? (
          <FadeIn delay={360} className="relative">
            <Carousel
              className="mx-auto max-w-5xl"
              opts={{ loop: reviews.length > 1 }}
            >
              <CarouselContent className="ml-0 gap-6 px-6 md:gap-8 md:px-8 lg:gap-10 lg:px-10">
                {reviews.map((review) => (
                  <CarouselItem
                    key={review.id}
                    className={cn(
                      'basis-full pl-0',
                      reviews.length > 1
                        ? 'md:basis-1/2 lg:basis-1/3'
                        : undefined,
                      'flex'
                    )}
                  >
                    <ReviewCard
                      authorName={review.author.name}
                      rating={review.rating}
                      body={review.text}
                      relativeTime={review.relativePublishTimeDescription}
                      avatarUrl={review.author.avatarUrl}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {reviews.length > 1 ? (
                <>
                  <CarouselPrevious className="hidden md:flex md:left-0 md:-translate-x-full" />
                  <CarouselNext className="hidden md:flex md:right-0 md:translate-x-full" />
                </>
              ) : null}
              {reviews.length >= INDICATOR_MIN_ITEMS ? (
                <CarouselDots className="static mt-12 flex justify-center" />
              ) : null}
            </Carousel>
          </FadeIn>
        ) : !error ? (
          <FadeIn
            as="p"
            delay={360}
            className="mx-auto max-w-xl text-sm text-muted-foreground"
          >
            Google has not returned any public reviews yet. Check back soon.
          </FadeIn>
        ) : null}

        {ctaHref && ctaLabel ? (
          <FadeIn as="div" delay={420} className="flex justify-center">
            <Button asChild variant={buttonVariant ?? 'default'}>
              <Link
                href={ctaHref}
                target={ctaTarget}
                rel={ctaTarget === '_blank' ? 'noopener noreferrer' : undefined}
              >
                {ctaLabel}
              </Link>
            </Button>
          </FadeIn>
        ) : null}

        <FadeIn as="p" delay={520} className="text-xs text-muted-foreground">
          Reviews provided by Google and subject to Google Maps Platform Terms.
        </FadeIn>
      </FadeIn>
    </SectionContainer>
  );
}
