// components/blocks/menu-section.tsx
import Image from 'next/image';
import { stegaClean } from 'next-sanity';
import { cn } from '@/lib/utils';
import SectionContainer from '@/components/ui/section-container';
import { FadeIn } from '@/components/ui/fade.in';
import { urlFor } from '@/sanity/lib/image';
import type { PAGE_QUERYResult, ColorVariant } from '@/sanity.types';
import type { CSSProperties } from 'react';
import MenuLottie from '@/components/blocks/menu/menu-lottie';

type MenuSectionProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>[number],
  { _type: 'menu-section' }
>;

type MenuImageType = NonNullable<MenuSectionProps['menuImages']>[number];
type MenuCategoryType = NonNullable<MenuSectionProps['categories']>[number];
type MenuItemType = NonNullable<NonNullable<MenuCategoryType['items']>[number]>;

const TEXTURE_STYLE_MAP: Record<string, CSSProperties> = {
  paper: {
    backgroundImage:
      'radial-gradient(circle at 1.5px 1.5px, var(--menu-texture-color, rgba(148, 163, 184, 0.18)) 1.5px, transparent 0)',
    backgroundSize: '34px 34px',
    opacity: 0.6,
  },
  canvas: {
    backgroundImage:
      'linear-gradient(90deg, var(--menu-texture-color, rgba(100, 116, 139, 0.12)) 1px, transparent 1px), linear-gradient(180deg, var(--menu-texture-color, rgba(100, 116, 139, 0.12)) 1px, transparent 1px)',
    backgroundSize: '36px 36px',
    opacity: 0.5,
  },
  linen: {
    backgroundImage:
      'linear-gradient(135deg, var(--menu-texture-color, rgba(148, 163, 184, 0.11)) 25%, transparent 25%), linear-gradient(225deg, var(--menu-texture-color, rgba(148, 163, 184, 0.11)) 25%, transparent 25%), linear-gradient(45deg, var(--menu-texture-color, rgba(148, 163, 184, 0.11)) 25%, transparent 25%), linear-gradient(315deg, var(--menu-texture-color, rgba(148, 163, 184, 0.11)) 25%, transparent 25%)',
    backgroundPosition: '7px 0, 7px 0, 0 0, 0 0',
    backgroundSize: '14px 14px',
    opacity: 0.55,
  },
};

const HEADING_FONT_CLASS: Record<string, string> = {
  serif: 'font-serif text-balance',
  sans: 'font-sans text-balance',
};

const DISPLAY_MODE_DEFAULT =
  'structured' satisfies MenuSectionProps['displayMode'];
const IMAGE_PLACEMENT_DEFAULT = 'right' satisfies Exclude<
  MenuSectionProps['imagePlacement'],
  null | undefined
>;
const IMAGE_LAYOUT_DEFAULT = 'stacked' satisfies Exclude<
  MenuSectionProps['imageLayout'],
  null | undefined
>;

function toColorVariant(value?: string | null): ColorVariant | undefined {
  return value ? (value as ColorVariant) : undefined;
}

function MenuImageCard({ image }: { image: MenuImageType }) {
  if (!image?.asset?._id) {
    return null;
  }

  const width = image.asset.metadata?.dimensions?.width ?? 1280;
  const height = image.asset.metadata?.dimensions?.height ?? 1920;
  const aspect = height / width;

  return (
    <figure className="overflow-hidden rounded-3xl border border-white/15 bg-white/50 shadow-lg backdrop-blur">
      <Image
        src={urlFor(image)
          .width(1400)
          .height(Math.round(aspect * 1400))
          .quality(85)
          .url()}
        alt={image.alt || 'Menu presentation'}
        width={width}
        height={height}
        className="h-auto w-full object-cover"
        placeholder={image.asset.metadata?.lqip ? 'blur' : undefined}
        blurDataURL={image.asset.metadata?.lqip || undefined}
        sizes="(min-width: 1024px) 480px, 100vw"
        loading="lazy"
      />
    </figure>
  );
}

function MenuImageGallery({
  images,
  layout,
  className,
}: {
  images: MenuImageType[];
  layout: 'stacked' | 'inline';
  className?: string;
}) {
  if (images.length === 0) {
    return null;
  }

  const containerClass =
    layout === 'inline' ? 'grid gap-6 sm:grid-cols-2' : 'flex flex-col gap-6';

  return (
    <div className={cn(containerClass, className)}>
      {images.map((image, index) => {
        const fallbackKey = image?.asset?._id ?? `menu-image-${index}`;
        const key = image?._key ?? fallbackKey;
        return <MenuImageCard image={image} key={key} />;
      })}
    </div>
  );
}

function ItemImage({ image }: { image: MenuItemType['itemImage'] }) {
  if (!image?.asset?._id) {
    return null;
  }

  const width = image.asset.metadata?.dimensions?.width ?? 240;
  const height = image.asset.metadata?.dimensions?.height ?? 240;
  const aspect = height / width;

  return (
    <Image
      src={urlFor(image)
        .width(320)
        .height(Math.round(aspect * 320))
        .quality(80)
        .url()}
      alt={image.alt || ''}
      width={width}
      height={height}
      className="h-20 w-20 flex-none rounded-2xl object-cover shadow-sm"
      placeholder={image.asset.metadata?.lqip ? 'blur' : undefined}
      blurDataURL={image.asset.metadata?.lqip || undefined}
      loading="lazy"
    />
  );
}

export default function MenuSection({
  padding,
  background,
  eyebrow,
  title,
  sectionId,
  intro,
  headingFont,
  displayMode,
  menuImages,
  categories,
  lottieAnimation,
  lottiePlacement,
  imagePlacement,
  imageLayout,
}: MenuSectionProps) {
  const anchorId = sectionId ? stegaClean(sectionId) : undefined;
  const sanitizedStyle = stegaClean(background?.style) as
    | 'color'
    | 'texture'
    | 'image'
    | null;

  const resolvedColorVariant = toColorVariant(
    sanitizedStyle === 'color'
      ? stegaClean(background?.colorVariant)
      : sanitizedStyle === 'texture'
        ? stegaClean(background?.textureTint)
        : undefined
  );
  const colorVariant =
    resolvedColorVariant ||
    (sanitizedStyle === 'texture'
      ? ('muted' satisfies ColorVariant)
      : undefined);

  const texturePreset = stegaClean(background?.texturePreset);
  const textureStyle =
    sanitizedStyle === 'texture' && texturePreset
      ? TEXTURE_STYLE_MAP[texturePreset as keyof typeof TEXTURE_STYLE_MAP]
      : undefined;
  const textureTintToken =
    sanitizedStyle === 'texture' && colorVariant
      ? `color-mix(in srgb, var(--color-${colorVariant}) 55%, transparent)`
      : undefined;
  const textureOverlayStyle: CSSProperties | undefined = textureStyle
    ? {
        ...textureStyle,
        ...(textureTintToken
          ? { ['--menu-texture-color' as const]: textureTintToken }
          : {}),
      }
    : undefined;

  const customBackgroundImage =
    sanitizedStyle === 'image' ? background?.customImage : undefined;
  const backgroundOpacity =
    customBackgroundImage?.opacity && customBackgroundImage.opacity > 0
      ? customBackgroundImage.opacity
      : 0.35;

  const sanitizedDisplayMode = (stegaClean(displayMode) ||
    DISPLAY_MODE_DEFAULT) as 'structured' | 'image' | 'combined';
  const showStructured =
    sanitizedDisplayMode === 'structured' ||
    sanitizedDisplayMode === 'combined';
  const showImages =
    sanitizedDisplayMode === 'image' || sanitizedDisplayMode === 'combined';

  const sanitizedHeadingFont = (stegaClean(headingFont) ||
    'sans') as keyof typeof HEADING_FONT_CLASS;
  const headingFontClass =
    HEADING_FONT_CLASS[sanitizedHeadingFont] || HEADING_FONT_CLASS.sans;

  const filteredCategories = (categories || []).filter(
    (category): category is MenuCategoryType => {
      if (!category) {
        return false;
      }
      const hasItems = (category.items || []).some((item) =>
        Boolean(item?.name)
      );
      return Boolean(category.title) || hasItems;
    }
  );

  const lottieUrl = lottieAnimation?.asset?.url;
  const lottiePosition = (stegaClean(lottiePlacement) || 'heading') as
    | 'heading'
    | 'aside';
  const shouldShowHeadingLottie = Boolean(
    lottieUrl && lottiePosition === 'heading'
  );
  const shouldShowAsideLottie = Boolean(
    lottieUrl && lottiePosition === 'aside'
  );

  const images = showImages
    ? (menuImages || []).filter(
        (image): image is NonNullable<MenuSectionProps['menuImages']>[number] =>
          Boolean(image?.asset?._id)
      )
    : [];

  const rawPlacement = (stegaClean(imagePlacement) ||
    IMAGE_PLACEMENT_DEFAULT) as 'left' | 'right' | 'split';
  const effectivePlacement =
    rawPlacement === 'split' && images.length <= 1 ? 'right' : rawPlacement;

  const sanitizedImageLayout = (stegaClean(imageLayout) ||
    IMAGE_LAYOUT_DEFAULT) as 'stacked' | 'inline';

  const leftImages =
    effectivePlacement === 'left'
      ? images
      : effectivePlacement === 'split'
        ? images.filter((_, index) => index % 2 === 0)
        : [];

  const rightImages =
    effectivePlacement === 'right'
      ? images
      : effectivePlacement === 'split'
        ? images.filter((_, index) => index % 2 === 1)
        : [];

  const hasLeftColumn = leftImages.length > 0;
  const hasRightColumn = rightImages.length > 0;
  const hasStructuredContent = showStructured && filteredCategories.length > 0;
  const hasHeadingContent = Boolean(
    eyebrow || title || intro || shouldShowHeadingLottie
  );
  const hasCentralColumn = hasHeadingContent || hasStructuredContent;

  const columnsCount =
    (hasLeftColumn ? 1 : 0) +
    (hasCentralColumn ? 1 : 0) +
    (hasRightColumn ? 1 : 0);

  const gridColumnsClass = cn(
    'relative z-10 grid gap-12 lg:gap-20',
    columnsCount === 3 &&
      'lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1fr)_minmax(0,0.6fr)]',
    columnsCount === 2 &&
      hasLeftColumn &&
      hasCentralColumn &&
      'lg:grid-cols-[minmax(0,0.65fr)_minmax(0,1fr)]',
    columnsCount === 2 &&
      hasCentralColumn &&
      hasRightColumn &&
      'lg:grid-cols-[minmax(0,1fr)_minmax(0,0.65fr)]',
    columnsCount === 2 &&
      !hasCentralColumn &&
      hasLeftColumn &&
      hasRightColumn &&
      'lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]',
    (columnsCount === 1 || columnsCount === 0) && 'lg:grid-cols-1',
    columnsCount === 1 && hasRightColumn && 'lg:justify-items-end',
    columnsCount === 1 && hasLeftColumn && 'lg:justify-items-start'
  );

  const singleColumnLayout = columnsCount === 1;

  const fallbackAsideToCenter =
    shouldShowAsideLottie && !hasLeftColumn && !hasRightColumn;

  return (
    <SectionContainer
      id={anchorId || undefined}
      color={colorVariant}
      padding={padding}
      className={cn(
        'overflow-hidden',
        sanitizedStyle === 'image' && 'bg-background'
      )}
    >
      <div className="relative">
        {textureOverlayStyle ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-80 mix-blend-multiply"
            style={textureOverlayStyle}
          />
        ) : null}
        {customBackgroundImage?.asset?._id ? (
          <div className="pointer-events-none absolute inset-0 -z-10">
            <Image
              src={urlFor(customBackgroundImage)
                .width(1600)
                .height(
                  Math.round(
                    ((customBackgroundImage.asset.metadata?.dimensions
                      ?.height || 1200) /
                      (customBackgroundImage.asset.metadata?.dimensions
                        ?.width || 1600)) *
                      1600
                  )
                )
                .quality(55)
                .url()}
              alt={customBackgroundImage.alt || 'Decorative menu background'}
              fill
              className="object-cover"
              priority={false}
            />
            <div
              className="absolute inset-0 bg-background"
              style={{ opacity: backgroundOpacity, mixBlendMode: 'multiply' }}
            />
          </div>
        ) : null}

        <div className={gridColumnsClass}>
          {hasLeftColumn ? (
            <FadeIn as="aside" delay={120} className="flex flex-col gap-8">
              <MenuImageGallery
                images={leftImages}
                layout={sanitizedImageLayout}
                className={cn(singleColumnLayout && 'lg:mr-auto')}
              />
              {shouldShowAsideLottie && effectivePlacement === 'left' ? (
                <div className="w-32 sm:w-40 lg:w-44">
                  <MenuLottie
                    src={lottieUrl!}
                    ariaLabel="Decorative animation"
                  />
                </div>
              ) : null}
            </FadeIn>
          ) : null}

          {hasCentralColumn ? (
            <FadeIn as="div" delay={160} className="flex flex-col gap-10">
              {hasHeadingContent ? (
                <div className="flex flex-col gap-6">
                  {eyebrow ? (
                    <FadeIn
                      as="p"
                      delay={200}
                      className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground"
                    >
                      {eyebrow}
                    </FadeIn>
                  ) : null}
                  {title || intro ? (
                    <div className="flex flex-col gap-6">
                      {title ? (
                        <FadeIn
                          as="h2"
                          delay={240}
                          className={cn(
                            'text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight',
                            headingFontClass
                          )}
                        >
                          {title}
                        </FadeIn>
                      ) : null}
                      {intro ? (
                        <FadeIn
                          as="p"
                          delay={280}
                          className="max-w-xl text-lg text-muted-foreground"
                        >
                          {intro}
                        </FadeIn>
                      ) : null}
                    </div>
                  ) : null}
                  {shouldShowHeadingLottie ? (
                    <FadeIn delay={320} className="w-40 sm:w-48">
                      <MenuLottie
                        src={lottieUrl!}
                        ariaLabel="Menu accent animation"
                      />
                    </FadeIn>
                  ) : null}
                </div>
              ) : null}

              {hasStructuredContent ? (
                <div className="space-y-12">
                  {filteredCategories.map((category, index) => {
                    const categoryKey =
                      category &&
                      typeof category === 'object' &&
                      '_key' in category &&
                      category._key
                        ? String(category._key)
                        : `${category?.title || 'category'}-${index}`;

                    return (
                      <FadeIn
                        as="section"
                        key={categoryKey}
                        delay={360 + index * 140}
                        className={cn(
                          'border-t border-border/30 pt-10',
                          index === 0 && 'border-t-0 pt-0'
                        )}
                      >
                        <div className="flex flex-col gap-3">
                          {category?.title ? (
                            <h3 className="text-xl font-semibold tracking-tight text-foreground">
                              {category.title}
                            </h3>
                          ) : null}
                          {category?.description ? (
                            <p className="text-sm text-muted-foreground">
                              {category.description}
                            </p>
                          ) : null}
                        </div>
                        <div className="mt-6 divide-y divide-border/20">
                          {(category?.items || []).map((item) => {
                            if (!item?.name) {
                              return null;
                            }
                            return (
                              <article
                                key={item._key || item.name}
                                className="py-6"
                              >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                  <div className="flex gap-4">
                                    {item.itemImage ? (
                                      <ItemImage image={item.itemImage} />
                                    ) : null}
                                    <div className="space-y-2">
                                      <div className="flex items-baseline justify-between gap-4">
                                        <h4 className="text-lg font-medium text-foreground">
                                          {item.name}
                                        </h4>
                                        <span className="text-base font-semibold tracking-wide text-foreground sm:text-right">
                                          {item.price}
                                        </span>
                                      </div>
                                      {item.description ? (
                                        <p className="text-sm text-muted-foreground">
                                          {item.description}
                                        </p>
                                      ) : null}
                                      {item.dietary ? (
                                        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                                          {item.dietary}
                                        </p>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              </article>
                            );
                          })}
                        </div>
                      </FadeIn>
                    );
                  })}
                </div>
              ) : null}

              {fallbackAsideToCenter ? (
                <FadeIn delay={380} className="self-end w-32 sm:w-40">
                  <MenuLottie
                    src={lottieUrl!}
                    ariaLabel="Decorative animation"
                  />
                </FadeIn>
              ) : null}
            </FadeIn>
          ) : null}

          {hasRightColumn ? (
            <FadeIn as="aside" delay={200} className="flex flex-col gap-8">
              <MenuImageGallery
                images={rightImages}
                layout={sanitizedImageLayout}
                className={cn(singleColumnLayout && 'lg:ml-auto')}
              />
              {shouldShowAsideLottie && effectivePlacement !== 'left' ? (
                <div className="self-end w-32 sm:w-40 lg:w-48">
                  <MenuLottie
                    src={lottieUrl!}
                    ariaLabel="Decorative animation"
                  />
                </div>
              ) : null}
            </FadeIn>
          ) : null}
        </div>

        {!hasCentralColumn &&
        !hasLeftColumn &&
        !hasRightColumn &&
        images.length > 0 ? (
          <FadeIn delay={160} className="relative z-10 mt-12">
            <MenuImageGallery images={images} layout={sanitizedImageLayout} />
          </FadeIn>
        ) : null}
      </div>
    </SectionContainer>
  );
}
