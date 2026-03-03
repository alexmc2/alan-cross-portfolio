// components/blocks/menu/google-menu-section.tsx
'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { stegaClean } from 'next-sanity';
import { MenuIcon, MoreHorizontal } from '@/lib/icons';

import SectionContainer from '@/components/ui/section-container';
import { cn } from '@/lib/utils';
import type { ColorVariant, SectionPadding } from '@/sanity.types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button1';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type RawDietary = string | null | undefined;

type MenuGoogleItem = {
  _key?: string;
  name?: string | null;
  price?: string | null;
  description?: string | null;
  dietary?: RawDietary[] | null;
};

type MenuGoogleCategory = {
  _key?: string;
  title?: string | null;
  tagline?: string | null;
  itemEntryMode?: 'structured' | 'text' | null;
  items?: MenuGoogleItem[] | null;
  rawItems?: string | null;
};

export type MenuGoogleSectionProps = {
  _type: 'menu-google-section';
  _key: string;
  padding?: SectionPadding | null;
  sectionId?: string | null;
  eyebrow?: string | null;
  title?: string | null;
  intro?: string | null;
  accordionBehaviour?: 'expanded' | 'first-open' | null;
  headingAlignment?: 'left' | 'center' | null;
  appearance?: {
    backgroundColor?: ColorVariant | null;
    backgroundColorDark?: ColorVariant | null;
    panelColor?: ColorVariant | null;
    panelColorDark?: ColorVariant | null;
    accentColor?: ColorVariant | null;
    accentColorDark?: ColorVariant | null;
    headingColor?: ColorVariant | null;
    headingColorDark?: ColorVariant | null;
    tabColor?: ColorVariant | null;
    tabColorDark?: ColorVariant | null;
    categoryColor?: ColorVariant | null;
    categoryColorDark?: ColorVariant | null;
    borderColor?: ColorVariant | null;
    borderColorDark?: ColorVariant | null;
  } | null;
  categories?: MenuGoogleCategory[] | null;
};

type ParsedMenuItem = {
  key: string;
  name: string;
  price?: string;
  description?: string;
  dietary: string[];
};

type ParsedCategory = {
  key: string;
  slug: string;
  title: string;
  tagline?: string;
  items: ParsedMenuItem[];
};

type MenuCSSVariables = CSSProperties & Record<`--menu-${string}`, string>;

const MAX_SCROLL_ATTEMPTS = 24;

const COLOR_FALLBACKS = {
  background: {
    base: 'var(--background)',
    foreground: 'var(--foreground)',
  },
  foreground: {
    base: 'var(--foreground)',
    foreground: 'var(--background)',
  },
  card: {
    base: 'var(--card)',
    foreground: 'var(--card-foreground)',
  },
  'card-foreground': {
    base: 'var(--card-foreground)',
    foreground: 'var(--card)',
  },
  popover: {
    base: 'var(--popover)',
    foreground: 'var(--popover-foreground)',
  },
  'popover-foreground': {
    base: 'var(--popover-foreground)',
    foreground: 'var(--popover)',
  },
  primary: {
    base: 'var(--primary)',
    foreground: 'var(--primary-foreground)',
  },
  'primary-foreground': {
    base: 'var(--primary-foreground)',
    foreground: 'var(--primary)',
  },
  secondary: {
    base: 'var(--secondary)',
    foreground: 'var(--secondary-foreground)',
  },
  'secondary-foreground': {
    base: 'var(--secondary-foreground)',
    foreground: 'var(--secondary)',
  },
  muted: {
    base: 'var(--muted)',
    foreground: 'var(--muted-foreground)',
  },
  'muted-foreground': {
    base: 'var(--muted-foreground)',
    foreground: 'var(--muted)',
  },
  accent: {
    base: 'var(--accent)',
    foreground: 'var(--accent-foreground)',
  },
  'accent-foreground': {
    base: 'var(--accent-foreground)',
    foreground: 'var(--accent)',
  },
  destructive: {
    base: 'var(--destructive)',
    foreground: 'var(--destructive-foreground)',
  },
  'destructive-foreground': {
    base: 'var(--destructive-foreground)',
    foreground: 'var(--destructive)',
  },
  white: {
    base: 'var(--white)',
    foreground: 'var(--white-foreground)',
  },
  'white-foreground': {
    base: 'var(--white-foreground)',
    foreground: 'var(--white)',
  },
  black: {
    base: 'var(--black)',
    foreground: 'var(--black-foreground)',
  },
  'black-foreground': {
    base: 'var(--black-foreground)',
    foreground: 'var(--black)',
  },
  'light-gray': {
    base: 'var(--light-gray)',
    foreground: 'var(--light-gray-foreground)',
  },
  'light-gray-foreground': {
    base: 'var(--light-gray-foreground)',
    foreground: 'var(--light-gray)',
  },
  'cool-gray': {
    base: 'var(--cool-gray)',
    foreground: 'var(--cool-gray-foreground)',
  },
  'cool-gray-foreground': {
    base: 'var(--cool-gray-foreground)',
    foreground: 'var(--cool-gray)',
  },
  'soft-blue': {
    base: 'var(--soft-blue)',
    foreground: 'var(--soft-blue-foreground)',
  },
  'soft-blue-foreground': {
    base: 'var(--soft-blue-foreground)',
    foreground: 'var(--soft-blue)',
  },
  'sky-blue': {
    base: 'var(--sky-blue)',
    foreground: 'var(--sky-blue-foreground)',
  },
  'sky-blue-foreground': {
    base: 'var(--sky-blue-foreground)',
    foreground: 'var(--sky-blue)',
  },
  mint: {
    base: 'var(--mint)',
    foreground: 'var(--mint-foreground)',
  },
  'mint-foreground': {
    base: 'var(--mint-foreground)',
    foreground: 'var(--mint)',
  },
  sand: {
    base: 'var(--sand)',
    foreground: 'var(--sand-foreground)',
  },
  'sand-foreground': {
    base: 'var(--sand-foreground)',
    foreground: 'var(--sand)',
  },
  peach: {
    base: 'var(--peach)',
    foreground: 'var(--peach-foreground)',
  },
  'peach-foreground': {
    base: 'var(--peach-foreground)',
    foreground: 'var(--peach)',
  },
  slate: {
    base: 'var(--slate)',
    foreground: 'var(--slate-foreground)',
  },
  'slate-foreground': {
    base: 'var(--slate-foreground)',
    foreground: 'var(--slate)',
  },
  navy: {
    base: 'var(--navy)',
    foreground: 'var(--navy-foreground)',
  },
  'navy-foreground': {
    base: 'var(--navy-foreground)',
    foreground: 'var(--navy)',
  },
  charcoal: {
    base: 'var(--charcoal)',
    foreground: 'var(--charcoal-foreground)',
  },
  'charcoal-foreground': {
    base: 'var(--charcoal-foreground)',
    foreground: 'var(--charcoal)',
  },
} as const satisfies Record<ColorVariant, { base: string; foreground: string }>;

const COLOR_VARIANT_VALUES = Object.keys(
  COLOR_FALLBACKS
) as readonly ColorVariant[];
const COLOR_VARIANT_SET = new Set<string>(
  COLOR_VARIANT_VALUES as readonly string[]
);

const MENU_PALETTE_PRESETS: Partial<
  Record<ColorVariant, { panel: ColorVariant; accent: ColorVariant }>
> = {
  background: { panel: 'card', accent: 'primary' },
  foreground: { panel: 'card', accent: 'primary' },
  primary: { panel: 'soft-blue', accent: 'white' },
  'primary-foreground': { panel: 'primary', accent: 'white' },
  secondary: { panel: 'white', accent: 'primary' },
  card: { panel: 'white', accent: 'primary' },
  popover: { panel: 'card', accent: 'primary' },
  accent: { panel: 'white', accent: 'primary' },
  destructive: { panel: 'white', accent: 'light-gray' },
  muted: { panel: 'white', accent: 'primary' },
  white: { panel: 'light-gray', accent: 'primary' },
  black: { panel: 'charcoal', accent: 'white' },
  'light-gray': { panel: 'white', accent: 'primary' },
  'cool-gray': { panel: 'white', accent: 'primary' },
  'soft-blue': { panel: 'white', accent: 'primary' },
  'sky-blue': { panel: 'white', accent: 'primary' },
  mint: { panel: 'white', accent: 'primary' },
  sand: { panel: 'white', accent: 'primary' },
  peach: { panel: 'white', accent: 'primary' },
  slate: { panel: 'white', accent: 'primary' },
  navy: { panel: 'soft-blue', accent: 'white' },
  charcoal: { panel: 'navy', accent: 'white' },
};

const DEFAULT_MENU_PRESET = {
  panel: 'card',
  accent: 'primary',
} as const satisfies { panel: ColorVariant; accent: ColorVariant };

function resolveMenuPreset(variant: ColorVariant) {
  const directPreset = MENU_PALETTE_PRESETS[variant];
  if (directPreset) {
    return directPreset;
  }

  if (variant.endsWith('-foreground')) {
    const baseCandidate = variant.replace(/-foreground$/, '');
    if (isColorVariant(baseCandidate)) {
      const basePreset = MENU_PALETTE_PRESETS[baseCandidate];
      if (basePreset) {
        return basePreset;
      }
    }
  }

  const backgroundPreset = MENU_PALETTE_PRESETS.background;
  return backgroundPreset ?? DEFAULT_MENU_PRESET;
}

function isColorVariant(value: string): value is ColorVariant {
  return COLOR_VARIANT_SET.has(value);
}

function toColorVariant(value?: string | null): ColorVariant | null {
  if (!value) {
    return null;
  }
  const cleaned = stegaClean(value);
  return isColorVariant(cleaned) ? (cleaned as ColorVariant) : null;
}

function colorVar(variant: ColorVariant, { foreground = false } = {}) {
  const fallback = COLOR_FALLBACKS[variant];
  const fallbackValue = foreground ? fallback.foreground : fallback.base;
  const suffix = foreground ? '-foreground' : '';
  return `var(--color-${variant}${suffix}, ${fallbackValue})`;
}

function slugify(input: string, fallback: string) {
  const slug = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .trim();
  return slug || fallback;
}

const PRICE_SEGMENT_REGEX =
  /^(?:£|\$|€)?\s*\d+(?:[.,]\d{1,2})?(?:\s?(?:pp|per|each))?$/i;
const PRICE_TEXT_REGEX =
  /^(?:market(?:\s+price)?|m\.?p\.?|mp|ask\s+for\s+price|tbd)$/i;

function cleanText(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function cleanName(value: string) {
  return cleanText(value.replace(/[–—-]\s*$/, ''));
}

function isPriceSegment(value?: string | null): value is string {
  if (!value) {
    return false;
  }
  const normalized = cleanText(value);
  if (!normalized) {
    return false;
  }
  return (
    PRICE_SEGMENT_REGEX.test(normalized) || PRICE_TEXT_REGEX.test(normalized)
  );
}

function parseDelimitedParts(parts: string[]) {
  const [rawName, ...rest] = parts;
  const name = cleanName(rawName);

  if (!rest.length) {
    return { name };
  }

  const priceIndex = rest.findIndex((segment) => isPriceSegment(segment));

  if (priceIndex === -1) {
    const descriptionOnly =
      rest.map(cleanText).filter(Boolean).join(' | ') || undefined;
    return { name, description: descriptionOnly };
  }

  const price = cleanText(rest[priceIndex]);
  const descriptionParts = [
    ...rest.slice(0, priceIndex),
    ...rest.slice(priceIndex + 1),
  ]
    .map(cleanText)
    .filter(Boolean);

  const description = descriptionParts.length
    ? descriptionParts.join(' | ')
    : undefined;

  return { name, price, description };
}

function parsePlainTextItems(
  rawItems: string,
  categoryKey: string
): ParsedMenuItem[] {
  const lines = rawItems
    .split(/\r?\n+/)
    .map((line) => cleanText(line))
    .filter(Boolean);

  const items: ParsedMenuItem[] = [];

  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line) {
      index += 1;
      continue;
    }

    const partsByPipe = line
      .split('|')
      .map((part) => cleanText(part))
      .filter(Boolean);
    const partsByTab = line
      .split('\t')
      .map((part) => cleanText(part))
      .filter(Boolean);
    const parts = partsByPipe.length > 1 ? partsByPipe : partsByTab;

    let name = '';
    let price: string | undefined;
    let description: string | undefined;
    let consumed = 0;

    if (parts.length > 1) {
      const parsed = parseDelimitedParts(parts);
      name = parsed.name;
      price = parsed.price;
      description = parsed.description;
    } else {
      const trailingPriceMatch = line.match(
        /(£|\$|€)?\s?\d[\d.,]*(?:\s?(?:pp|per|each))?$/i
      );
      if (trailingPriceMatch) {
        const match = trailingPriceMatch[0];
        const priceStart =
          trailingPriceMatch.index ?? line.length - match.length;
        name = cleanName(line.slice(0, priceStart));
        price = cleanText(match);
      } else {
        name = cleanName(line);
      }

      if (!price) {
        const next = lines[index + 1];
        const nextNext = lines[index + 2];

        if (next && nextNext && isPriceSegment(nextNext)) {
          // Handle Google copy pattern: name, description, then price.
          description = cleanText(next);
          price = cleanText(nextNext);
          consumed = 2;
        } else if (next && isPriceSegment(next)) {
          price = cleanText(next);
          consumed = 1;
        }
      }
    }

    if (description && price && isPriceSegment(description)) {
      // Handle edge case where description mistakenly captured a price string.
      price = description;
      description = undefined;
    }

    if (name) {
      items.push({
        key: `${categoryKey}-raw-${index}`,
        name,
        price,
        description,
        dietary: [],
      });
    }

    index += consumed + 1;
  }

  return items;
}

function normalizeDietary(dietary?: RawDietary[] | null): string[] {
  if (!dietary?.length) {
    return [];
  }
  return dietary
    .map((tag) => (typeof tag === 'string' ? stegaClean(tag) : undefined))
    .map((tag) => (tag ? tag.trim() : ''))
    .filter((tag): tag is string => Boolean(tag));
}

function normalizeCategories(
  rawCategories: MenuGoogleCategory[]
): ParsedCategory[] {
  const categories: ParsedCategory[] = [];

  rawCategories.forEach((category, index) => {
    const title = stegaClean(category?.title) || `Category ${index + 1}`;
    const tagline = category?.tagline
      ? stegaClean(category.tagline)
      : undefined;
    const entryMode = (stegaClean(category?.itemEntryMode) || 'structured') as
      | 'structured'
      | 'text';
    const key = category?._key || `menu-category-${index}`;
    const slug = slugify(title, key);

    if (entryMode === 'text') {
      const raw = category?.rawItems ? stegaClean(category.rawItems) : '';
      const items = parsePlainTextItems(raw, key);
      if (items.length === 0) {
        return;
      }
      categories.push({
        key,
        slug,
        title,
        tagline,
        items,
      });
      return;
    }

    const structuredItems: ParsedMenuItem[] = [];
    (category?.items || []).forEach((item, itemIndex) => {
      if (!item) {
        return;
      }
      const name = item?.name ? stegaClean(item.name) : '';
      if (!name) {
        return;
      }
      structuredItems.push({
        key: item?._key || `${key}-item-${itemIndex}`,
        name,
        price: item?.price ? stegaClean(item.price) : undefined,
        description: item?.description
          ? stegaClean(item.description)
          : undefined,
        dietary: normalizeDietary(item?.dietary),
      });
    });

    if (!structuredItems.length) {
      return;
    }

    categories.push({
      key,
      slug,
      title,
      tagline,
      items: structuredItems,
    });
  });

  return categories;
}

function useActiveCategoryObserver(
  categories: ParsedCategory[],
  setActiveCategory: (slug: string) => void
) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (!categories.length || typeof window === 'undefined') {
      return () => undefined;
    }

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0)
          );

        if (visible.length > 0) {
          const best = visible[0]?.target?.getAttribute('data-category-slug');
          if (best) {
            setActiveCategory(best);
          }
        }
      },
      {
        root: null,
        rootMargin: '-40% 0px -40%',
        threshold: [0.25, 0.5, 0.75],
      }
    );

    const observer = observerRef.current;
    categories.forEach((category) => {
      const node = categoryRefs.current[category.slug];
      if (node) {
        observer.observe(node);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [categories, setActiveCategory]);

  const registerCategoryRef = useCallback((slug: string) => {
    return (node: HTMLElement | null) => {
      categoryRefs.current[slug] = node;
    };
  }, []);

  return registerCategoryRef;
}

export default function MenuGoogleSection(props: MenuGoogleSectionProps) {
  const {
    padding,
    sectionId,
    eyebrow,
    title,
    intro,
    accordionBehaviour,
    headingAlignment,
    appearance,
    categories: rawCategories,
  } = props;

  const resolvedHeadingAlignment =
    headingAlignment === 'center' ? 'center' : 'left';
  const isHeadingCentered = resolvedHeadingAlignment === 'center';

  const backgroundVariant =
    toColorVariant(appearance?.backgroundColor) ?? 'background';
  const preset = resolveMenuPreset(backgroundVariant);
  const panelVariant = toColorVariant(appearance?.panelColor) ?? preset.panel;
  const accentVariant =
    toColorVariant(appearance?.accentColor) ?? preset.accent;

  const backgroundVariantDark = toColorVariant(appearance?.backgroundColorDark);
  const panelVariantDark = toColorVariant(appearance?.panelColorDark);
  const accentVariantDark = toColorVariant(appearance?.accentColorDark);
  const headingVariant = toColorVariant(appearance?.headingColor);
  const headingVariantDark = toColorVariant(appearance?.headingColorDark);
  const tabVariant = toColorVariant(appearance?.tabColor);
  const tabVariantDark = toColorVariant(appearance?.tabColorDark);
  const categoryVariant = toColorVariant(appearance?.categoryColor);
  const categoryVariantDark = toColorVariant(appearance?.categoryColorDark);
  const borderVariant = toColorVariant(appearance?.borderColor);
  const borderVariantDark = toColorVariant(appearance?.borderColorDark);

  const backgroundColor = colorVar(backgroundVariant);
  const backgroundForeground = colorVar(backgroundVariant, {
    foreground: true,
  });
  const backgroundColorDark = backgroundVariantDark
    ? colorVar(backgroundVariantDark)
    : backgroundColor;
  const backgroundForegroundDark = backgroundVariantDark
    ? colorVar(backgroundVariantDark, { foreground: true })
    : backgroundForeground;

  const panelColor = colorVar(panelVariant);
  const panelForeground = colorVar(panelVariant, { foreground: true });
  const panelColorDark = panelVariantDark
    ? colorVar(panelVariantDark)
    : panelColor;
  const panelForegroundDark = panelVariantDark
    ? colorVar(panelVariantDark, { foreground: true })
    : panelForeground;

  const accentColor = colorVar(accentVariant);
  const accentForeground = colorVar(accentVariant, { foreground: true });
  const accentColorDark = accentVariantDark
    ? colorVar(accentVariantDark)
    : accentColor;
  const accentForegroundDark = accentVariantDark
    ? colorVar(accentVariantDark, { foreground: true })
    : accentForeground;

  const headingColor = headingVariant
    ? colorVar(headingVariant)
    : backgroundForeground;
  const headingColorDark = headingVariantDark
    ? colorVar(headingVariantDark)
    : headingVariant
      ? colorVar(headingVariant)
      : backgroundForegroundDark;

  const navBaseColor = tabVariant
    ? colorVar(tabVariant)
    : `color-mix(in srgb, ${panelForeground} 65%, ${backgroundForeground} 35%)`;
  const navActiveColor = tabVariant ? colorVar(tabVariant) : accentColor;
  const navBaseColorDark = tabVariantDark
    ? colorVar(tabVariantDark)
    : tabVariant
      ? colorVar(tabVariant)
      : `color-mix(in srgb, ${panelForegroundDark} 65%, ${backgroundForegroundDark} 35%)`;
  const navActiveColorDark = tabVariantDark
    ? colorVar(tabVariantDark)
    : accentColorDark;

  const categoryTitleColor = categoryVariant
    ? colorVar(categoryVariant)
    : backgroundForeground;
  const categoryTitleActiveColor = categoryVariant
    ? colorVar(categoryVariant)
    : accentColor;
  const categoryTitleColorDark = categoryVariantDark
    ? colorVar(categoryVariantDark)
    : categoryVariant
      ? colorVar(categoryVariant)
      : backgroundForegroundDark;
  const categoryTitleActiveColorDark = categoryVariantDark
    ? colorVar(categoryVariantDark)
    : categoryVariant
      ? colorVar(categoryVariant)
      : accentColorDark;

  const borderColor = borderVariant
    ? colorVar(borderVariant)
    : `color-mix(in srgb, ${panelColor} 74%, ${accentColor} 26%)`;
  const borderColorDark = borderVariantDark
    ? colorVar(borderVariantDark)
    : borderVariant
      ? colorVar(borderVariant)
      : `color-mix(in srgb, ${panelColorDark} 74%, ${accentColorDark} 26%)`;

  const paletteStyle = useMemo<MenuCSSVariables>(() => {
    const style: MenuCSSVariables = {
      '--menu-headline': headingColor,
      '--menu-headline-dark': headingColorDark,
      '--menu-muted': `color-mix(in srgb, ${panelForeground} 60%, ${backgroundForeground} 40%)`,
      '--menu-muted-dark': `color-mix(in srgb, ${panelForegroundDark} 60%, ${backgroundForegroundDark} 40%)`,
      '--menu-border-color': borderColor,
      '--menu-border-color-dark': borderColorDark,
      '--menu-surface': panelColor,
      '--menu-surface-dark': panelColorDark,
      '--menu-surface-foreground': panelForeground,
      '--menu-surface-foreground-dark': panelForegroundDark,
      '--menu-surface-hover': `color-mix(in srgb, ${accentColor} 12%, ${panelColor} 88%)`,
      '--menu-surface-hover-dark': `color-mix(in srgb, ${accentColorDark} 12%, ${panelColorDark} 88%)`,
      '--menu-shell-bg': `color-mix(in srgb, ${panelColor} 24%, ${backgroundColor} 76%)`,
      '--menu-shell-bg-dark': `color-mix(in srgb, ${panelColorDark} 24%, ${backgroundColorDark} 76%)`,
      '--menu-nav-base': navBaseColor,
      '--menu-nav-active': navActiveColor,
      '--menu-nav-base-dark': navBaseColorDark,
      '--menu-nav-active-dark': navActiveColorDark,
      '--menu-active-bg': `color-mix(in srgb, ${accentColor} 18%, ${panelColor} 82%)`,
      '--menu-active-bg-dark': `color-mix(in srgb, ${accentColorDark} 18%, ${panelColorDark} 82%)`,
      '--menu-badge-bg': `color-mix(in srgb, ${accentColor} 20%, ${panelColor} 80%)`,
      '--menu-badge-bg-dark': `color-mix(in srgb, ${accentColorDark} 20%, ${panelColorDark} 80%)`,
      '--menu-badge-text': accentForeground,
      '--menu-badge-text-dark': accentForegroundDark,
      '--menu-price': `color-mix(in srgb, ${accentColor} 45%, ${panelForeground} 55%)`,
      '--menu-price-dark': `color-mix(in srgb, ${accentColorDark} 45%, ${panelForegroundDark} 55%)`,
      '--menu-background': backgroundColor,
      '--menu-background-dark': backgroundColorDark,
      '--menu-category-title': categoryTitleColor,
      '--menu-category-title-active': categoryTitleActiveColor,
      '--menu-category-title-dark': categoryTitleColorDark,
      '--menu-category-title-active-dark': categoryTitleActiveColorDark,
    };

    return style;
  }, [
    accentColor,
    accentColorDark,
    accentForeground,
    accentForegroundDark,
    backgroundColor,
    backgroundColorDark,
    backgroundForeground,
    backgroundForegroundDark,
    headingColor,
    headingColorDark,
    categoryTitleActiveColor,
    categoryTitleColor,
    categoryTitleActiveColorDark,
    categoryTitleColorDark,
    borderColor,
    borderColorDark,
    panelColor,
    panelColorDark,
    panelForeground,
    panelForegroundDark,
    navActiveColor,
    navBaseColor,
    navActiveColorDark,
    navBaseColorDark,
  ]);

  const sectionStyle = useMemo<MenuCSSVariables>(() => {
    const style: MenuCSSVariables = {
      '--menu-background': backgroundColor,
      '--menu-background-dark': backgroundColorDark,
    };

    return style;
  }, [backgroundColor, backgroundColorDark]);

  const parsedCategories = useMemo(() => {
    const safeCategories =
      rawCategories?.filter((category): category is MenuGoogleCategory =>
        Boolean(category)
      ) ?? [];
    return normalizeCategories(safeCategories);
  }, [rawCategories]);

  const fallbackSlug = parsedCategories[0]?.slug;
  const [activeCategory, setActiveCategory] = useState<string>(
    fallbackSlug || ''
  );

  useEffect(() => {
    if (fallbackSlug) {
      setActiveCategory(fallbackSlug);
    }
  }, [fallbackSlug]);

  const registerCategoryRef = useActiveCategoryObserver(
    parsedCategories,
    setActiveCategory
  );

  const initialExpanded = useMemo(() => {
    if (!parsedCategories.length) {
      return [] as string[];
    }

    const behaviour = (stegaClean(accordionBehaviour) || 'expanded') as
      | 'expanded'
      | 'first-open';

    if (behaviour === 'expanded') {
      return parsedCategories.map((category) => category.slug);
    }

    return [parsedCategories[0]?.slug].filter(Boolean) as string[];
  }, [accordionBehaviour, parsedCategories]);

  const [openCategories, setOpenCategories] =
    useState<string[]>(initialExpanded);

  useEffect(() => {
    setOpenCategories(initialExpanded);
  }, [initialExpanded]);

  const navButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const hasRanInitialScroll = useRef(false);
  const pendingScrollSlugRef = useRef<string | null>(null);
  const lastClickedSlugRef = useRef<string | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  const scrollActiveNavButtonIntoView = useCallback(
    (button: HTMLButtonElement | null) => {
      if (!button) {
        return;
      }

      const container = button.parentElement;
      if (!(container instanceof HTMLElement)) {
        return;
      }

      if (container.scrollWidth <= container.clientWidth) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();

      const isLeftOverflow = buttonRect.left < containerRect.left;
      const isRightOverflow = buttonRect.right > containerRect.right;

      if (!isLeftOverflow && !isRightOverflow) {
        return;
      }

      const scrollDelta = isLeftOverflow
        ? buttonRect.left - containerRect.left
        : buttonRect.right - containerRect.right;

      container.scrollBy({ left: scrollDelta, behavior: 'smooth' });
    },
    []
  );

  const cancelPendingAnimation = useCallback(() => {
    if (typeof window === 'undefined') {
      scrollTimeoutRef.current = null;
      return;
    }

    if (scrollTimeoutRef.current !== null) {
      window.clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }
  }, []);

  const scrollCategoryIntoView = useCallback((slug: string) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      pendingScrollSlugRef.current = null;
      cancelPendingAnimation();
      return;
    }

    cancelPendingAnimation();

    const readHeaderOffset = () => {
      const root = document.documentElement;
      if (!root) {
        return 0;
      }

      const styles = window.getComputedStyle(root);
      const raw = styles.getPropertyValue('--header-height');
      const parsed = Number.parseFloat(raw);

      if (Number.isFinite(parsed)) {
        return parsed;
      }

      return 0;
    };

    const attemptScroll = (attempt: number) => {
      const target = document.getElementById(slug);

      if (!target) {
        if (attempt < MAX_SCROLL_ATTEMPTS) {
          scrollTimeoutRef.current = window.setTimeout(
            () => attemptScroll(attempt + 1),
            40
          );
          return;
        }

        pendingScrollSlugRef.current = null;
        cancelPendingAnimation();
        return;
      }

      const rect = target.getBoundingClientRect();
      const isCollapsed =
        rect.height === 0 || target.closest('[data-state="closed"]');

      if (isCollapsed && attempt < MAX_SCROLL_ATTEMPTS) {
        scrollTimeoutRef.current = window.setTimeout(
          () => attemptScroll(attempt + 1),
          40
        );
        return;
      }

      const headerOffset = readHeaderOffset();
      const extraGap = 12;
      const targetTop =
        rect.top + window.pageYOffset - headerOffset - extraGap;

      window.scrollTo({
        top: targetTop <= 0 ? 0 : targetTop,
        behavior: 'smooth',
      });

      const navButton = navButtonRefs.current[slug];
      navButton?.focus?.({ preventScroll: true });

      pendingScrollSlugRef.current = null;
      cancelPendingAnimation();
    };

    // allow the sheet close animation to release scroll lock before scrolling
    scrollTimeoutRef.current = window.setTimeout(() => attemptScroll(0), 80);
  }, [cancelPendingAnimation]);

  useEffect(() => {
    return () => {
      cancelPendingAnimation();
    };
  }, [cancelPendingAnimation]);

  useEffect(() => {
    const slug = pendingScrollSlugRef.current;
    if (!slug) {
      return;
    }

    if (!openCategories.includes(slug)) {
      return;
    }

    scrollCategoryIntoView(slug);
  }, [openCategories, pendingScrollSlugRef, scrollCategoryIntoView]);

  useEffect(() => {
    if (!hasRanInitialScroll.current) {
      hasRanInitialScroll.current = true;
      return;
    }

    const activeButton = activeCategory
      ? navButtonRefs.current[activeCategory]
      : null;
    scrollActiveNavButtonIntoView(activeButton ?? null);
  }, [activeCategory, scrollActiveNavButtonIntoView]);

  const anchorId = sectionId ? stegaClean(sectionId) : undefined;
  const desktopNavWrapperRef = useRef<HTMLDivElement | null>(null);
  const desktopNavListRef = useRef<HTMLElement | null>(null);
  const measurementContainerRef = useRef<HTMLDivElement | null>(null);
  const moreButtonMeasurementRef = useRef<HTMLElement | null>(null);

  const [desktopVisibleCount, setDesktopVisibleCount] = useState(
    parsedCategories.length
  );
  const [hasDesktopOverflow, setHasDesktopOverflow] = useState(false);

  useEffect(() => {
    setDesktopVisibleCount(parsedCategories.length);
  }, [parsedCategories.length]);

  const recomputeDesktopNav = useCallback(() => {
    const wrapper = desktopNavWrapperRef.current;
    const measurement = measurementContainerRef.current;

    if (!wrapper || !measurement) {
      setDesktopVisibleCount(parsedCategories.length);
      setHasDesktopOverflow(false);
      return;
    }

    const wrapperWidth = wrapper.clientWidth;

    if (!wrapperWidth) {
      setDesktopVisibleCount(parsedCategories.length);
      setHasDesktopOverflow(false);
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const measurementStyles = window.getComputedStyle(measurement);
    const gapValue = parseFloat(measurementStyles.columnGap || '0');

    const computeFit = (availableWidth: number) => {
      if (!Number.isFinite(availableWidth) || availableWidth <= 0) {
        return 0;
      }

      let usedWidth = 0;
      let fitCount = 0;

      for (let index = 0; index < parsedCategories.length; index += 1) {
        const category = parsedCategories[index];
        const button = measurement.querySelector<HTMLElement>(
          `[data-measure-slug="${category.slug}"]`
        );

        if (!button) {
          continue;
        }

        const buttonWidth = button.offsetWidth;

        if (!buttonWidth) {
          continue;
        }

        const gap = fitCount === 0 ? 0 : gapValue;

        if (usedWidth + gap + buttonWidth > availableWidth) {
          break;
        }

        usedWidth += gap + buttonWidth;
        fitCount += 1;
      }

      return fitCount;
    };

    let fitCount = computeFit(wrapperWidth);

    if (fitCount >= parsedCategories.length) {
      setDesktopVisibleCount(parsedCategories.length);
      setHasDesktopOverflow(false);
      return;
    }

    const moreWidth = moreButtonMeasurementRef.current?.offsetWidth ?? 0;
    const availableWithMore = Math.max(wrapperWidth - moreWidth - gapValue, 0);

    fitCount = computeFit(availableWithMore);

    if (parsedCategories.length > 0 && fitCount === 0) {
      fitCount = 1;
    }

    setDesktopVisibleCount(fitCount);
    setHasDesktopOverflow(fitCount < parsedCategories.length);
  }, [parsedCategories]);

  useLayoutEffect(() => {
    recomputeDesktopNav();
  }, [recomputeDesktopNav]);

  useEffect(() => {
    const wrapper = desktopNavWrapperRef.current;

    if (!wrapper) {
      return;
    }

    const handleResize = () => {
      recomputeDesktopNav();
    };

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => handleResize());
      observer.observe(wrapper);

      return () => observer.disconnect();
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [recomputeDesktopNav]);

  useEffect(() => {
    const measurement = measurementContainerRef.current;

    if (!measurement || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(() => {
      recomputeDesktopNav();
    });

    observer.observe(measurement);

    return () => observer.disconnect();
  }, [recomputeDesktopNav]);

  const desktopVisibleTabs = parsedCategories.slice(0, desktopVisibleCount);
  const desktopOverflowTabs = parsedCategories.slice(desktopVisibleCount);

  const handleNavClick = (slug: string) => {
    hasRanInitialScroll.current = true;
    lastClickedSlugRef.current = slug;
    pendingScrollSlugRef.current = slug;
    setActiveCategory(slug);
    const alreadyOpen = openCategories.includes(slug);
    setOpenCategories((prev) => {
      if (prev.includes(slug)) {
        return prev;
      }
      return [...prev, slug];
    });
    if (alreadyOpen) {
      scrollCategoryIntoView(slug);
    }
  };

  if (!parsedCategories.length) {
    return null;
  }

  const hasHeadingContent = Boolean(eyebrow || title || intro);

  return (
    <SectionContainer
      id={anchorId}
      padding={padding}
      color={backgroundVariant}
      className="relative overflow-hidden bg-[color:var(--menu-background)] dark:bg-[color:var(--menu-background-dark)]"
      style={sectionStyle}
    >
      <div
        className="relative mx-auto flex w-full max-w-6xl flex-col gap-10  text-[color:var(--menu-headline)] dark:text-[color:var(--menu-headline-dark)] px-2"
        style={paletteStyle}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 mix-blend-screen"
          aria-hidden
        />
        {hasHeadingContent ? (
          <header
            className={cn(
              'flex flex-col gap-4',
              isHeadingCentered && 'items-center text-center'
            )}
          >
            {eyebrow ? (
              <p
                className={cn(
                  'text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--menu-muted)] dark:text-[color:var(--menu-muted-dark)]',
                  isHeadingCentered && 'mx-auto'
                )}
              >
                {stegaClean(eyebrow)}
              </p>
            ) : null}
            {title ? (
              <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--menu-headline)] dark:text-[color:var(--menu-headline-dark)] sm:text-4xl lg:text-5xl">
                {stegaClean(title)}
              </h2>
            ) : null}
            {intro ? (
              <p
                className={cn(
                  'max-w-2xl text-base text-[color:var(--menu-muted)] dark:text-[color:var(--menu-muted-dark)] sm:text-lg',
                  isHeadingCentered && 'mx-auto'
                )}
              >
                {stegaClean(intro)}
              </p>
            ) : null}
          </header>
        ) : null}

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-2 rounded-full border border-[color:var(--menu-border-color)] bg-transparent px-3 py-2 text-sm font-medium text-[color:var(--menu-nav-base)] transition-colors hover:text-[color:var(--menu-nav-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--menu-nav-active)] focus-visible:ring-offset-2 dark:border-[color:var(--menu-border-color-dark)] dark:text-[color:var(--menu-nav-base-dark)] dark:hover:text-[color:var(--menu-nav-active-dark)] dark:focus-visible:ring-[color:var(--menu-nav-active-dark)]"
                >
                  <MenuIcon className="size-4" />
                  <span>{title ? stegaClean(title) : 'Menu'}</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="backdrop-blur-xl border border-[color:var(--menu-border-color)] bg-background text-[color:var(--menu-headline)] dark:border-[color:var(--menu-border-color-dark)] dark:bg-[color:var(--menu-background-dark)] dark:text-[color:var(--menu-headline-dark)]"
                style={paletteStyle}
                onCloseAutoFocus={(event) => {
                  event.preventDefault();
                  const slug = lastClickedSlugRef.current;
                  if (!slug) {
                    return;
                  }

                  const nextFocusTarget = navButtonRefs.current[slug];
                  nextFocusTarget?.focus?.({ preventScroll: true });
                }}
              >
                <SheetHeader className="border-b border-[color:var(--menu-border-color)] px-4 pt-5 dark:border-[color:var(--menu-border-color-dark)]">
                  <SheetTitle className="text-lg font-semibold text-[color:var(--menu-headline)] dark:text-[color:var(--menu-headline-dark)]">
                    {title ? stegaClean(title) : 'Menu'}
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4 py-4">
                  {parsedCategories.map((category) => (
                    <SheetClose asChild key={`${category.key}-sheet`}>
                      <button
                        type="button"
                        onClick={() => handleNavClick(category.slug)}
                        className={cn(
                          'rounded-md px-3 py-2 text-left text-md font-medium transition-colors',
                          'text-[color:var(--menu-nav-base)] hover:bg-[color:var(--menu-active-bg)] hover:text-[color:var(--menu-nav-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--menu-nav-active)] focus-visible:ring-offset-2 dark:hover:bg-[color:var(--menu-active-bg-dark)] dark:text-[color:var(--menu-nav-base-dark)] dark:hover:text-[color:var(--menu-nav-active-dark)] dark:focus-visible:ring-[color:var(--menu-nav-active-dark)]',
                          activeCategory === category.slug &&
                            'bg-[color:var(--menu-active-bg)] text-[color:var(--menu-nav-active)] dark:bg-[color:var(--menu-active-bg-dark)] dark:text-[color:var(--menu-nav-active-dark)]'
                        )}
                      >
                        {category.title}
                      </button>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            <div className="flex-1 overflow-hidden">
              <div className="relative">
                <nav
                  className="scrollbar-thin flex gap-4 overflow-x-auto pb-1 pr-6"
                  aria-label="Menu categories"
                >
                  {parsedCategories.map((category) => (
                    <button
                      key={`${category.key}-mobile`}
                      type="button"
                      ref={(node) => {
                        navButtonRefs.current[category.slug] = node;
                      }}
                      onClick={() => handleNavClick(category.slug)}
                      className={cn(
                        'relative flex-shrink-0 scroll-mx-4 whitespace-nowrap border-b-2 border-transparent pb-2 text-sm font-medium transition-colors',
                        'text-[color:var(--menu-nav-base)] hover:text-[color:var(--menu-nav-active)] dark:text-[color:var(--menu-nav-base-dark)] dark:hover:text-[color:var(--menu-nav-active-dark)]',
                        activeCategory === category.slug &&
                          'border-b-[3px] border-[color:var(--menu-nav-active)] text-[color:var(--menu-nav-active)] dark:border-[color:var(--menu-nav-active-dark)] dark:text-[color:var(--menu-nav-active-dark)]'
                      )}
                      data-active={activeCategory === category.slug}
                    >
                      {category.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          <div
            ref={desktopNavWrapperRef}
            className="hidden items-center justify-between lg:flex"
          >
            <nav
              ref={desktopNavListRef}
              className="flex items-center gap-3"
              aria-label="Menu categories"
            >
              {desktopVisibleTabs.map((category) => (
                <button
                  key={`${category.key}-desktop`}
                  type="button"
                  ref={(node) => {
                    navButtonRefs.current[category.slug] = node;
                  }}
                  onClick={() => handleNavClick(category.slug)}
                  className={cn(
                    'relative whitespace-nowrap border-b-2 border-transparent pb-2 text-xl font-medium transition-colors',
                    'text-[color:var(--menu-nav-base)] hover:text-[color:var(--menu-nav-active)] dark:text-[color:var(--menu-nav-base-dark)] dark:hover:text-[color:var(--menu-nav-active-dark)]',
                    activeCategory === category.slug &&
                      'border-b-[3px] border-[color:var(--menu-nav-active)] text-[color:var(--menu-nav-active)] dark:border-[color:var(--menu-nav-active-dark)] dark:text-[color:var(--menu-nav-active-dark)]'
                  )}
                  data-active={activeCategory === category.slug}
                >
                  {category.title}
                </button>
              ))}
            </nav>

            {hasDesktopOverflow ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="gap-2 rounded-full border border-[color:var(--menu-border-color)] bg-transparent px-3 py-2 text-sm font-medium text-[color:var(--menu-nav-base)] transition-colors hover:text-[color:var(--menu-nav-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--menu-nav-active)] focus-visible:ring-offset-2 dark:border-[color:var(--menu-border-color-dark)] dark:text-[color:var(--menu-nav-base-dark)] dark:hover:text-[color:var(--menu-nav-active-dark)] dark:focus-visible:ring-[color:var(--menu-nav-active-dark)]"
                  >
                    More
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="min-w-[12rem] border-[color:var(--menu-border-color)] bg-[color:var(--menu-surface)] text-[color:var(--menu-surface-foreground)] dark:border-[color:var(--menu-border-color-dark)] dark:bg-[color:var(--menu-surface-dark)] dark:text-[color:var(--menu-surface-foreground-dark)]"
                  style={paletteStyle}
                >
                  {desktopOverflowTabs.map((category) => (
                    <DropdownMenuItem
                      key={`${category.key}-overflow`}
                      className="text-[color:var(--menu-surface-foreground)] focus:bg-[color:var(--menu-active-bg)] focus:text-[color:var(--menu-nav-active)] dark:bg-[color:var(--menu-surface-dark)] dark:text-[color:var(--menu-surface-foreground-dark)] dark:focus:bg-[color:var(--menu-active-bg-dark)] dark:focus:text-[color:var(--menu-nav-active-dark)]"
                      onSelect={(event) => {
                        event.preventDefault();
                        handleNavClick(category.slug);
                      }}
                    >
                      {category.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none fixed -left-[9999px] top-0 flex items-center gap-3"
          ref={measurementContainerRef}
        >
          {parsedCategories.map((category) => (
            <span
              key={`${category.key}-measure`}
              data-measure-slug={category.slug}
              className="relative inline-block whitespace-nowrap border-b-2 border-transparent pb-2 text-xl font-medium"
            >
              {category.title}
            </span>
          ))}
          <span
            ref={moreButtonMeasurementRef}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'gap-2 rounded-full border border-[color:var(--menu-border-color)] bg-transparent px-3 py-2 text-sm font-medium text-[color:var(--menu-nav-base)]'
            )}
          >
            More
            <MoreHorizontal className="size-4" />
          </span>
        </div>

        <Accordion
          type="multiple"
          value={openCategories}
          onValueChange={(value) => setOpenCategories(value as string[])}
          className="rounded-2xl border border-[color:var(--menu-border-color)] bg-[color:var(--menu-shell-bg)] text-[color:var(--menu-surface-foreground)] dark:border-[color:var(--menu-border-color-dark)] dark:bg-[color:var(--menu-shell-bg-dark)] dark:text-[color:var(--menu-surface-foreground-dark)]"
        >
          {parsedCategories.map((category) => (
            <AccordionItem
              key={category.key}
              value={category.slug}
              className="border-b border-[color:var(--menu-border-color)] last:border-b-0 dark:border-[color:var(--menu-border-color-dark)]"
            >
              <AccordionTrigger
                className={cn(
                  'gap-4 rounded-none border-none px-6 text-left text-base font-semibold transition-colors',
                  'text-[color:var(--menu-category-title)] hover:text-[color:var(--menu-category-title-active)] dark:text-[color:var(--menu-category-title-dark)] dark:hover:text-[color:var(--menu-category-title-active-dark)]',
                  activeCategory === category.slug &&
                    'text-[color:var(--menu-category-title-active)] dark:text-[color:var(--menu-category-title-active-dark)]'
                )}
                onClick={() => setActiveCategory(category.slug)}
              >
                <div>
                  <div className="text-lg font-semibold tracking-tight">
                    {category.title}
                  </div>
                  {category.tagline ? (
                    <div className="mt-1 text-sm font-normal text-[color:var(--menu-muted)] dark:text-[color:var(--menu-muted-dark)]">
                      {category.tagline}
                    </div>
                  ) : null}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div
                  ref={registerCategoryRef(category.slug)}
                  id={category.slug}
                  data-category-slug={category.slug}
                  className="px-6 pb-6 text-[color:var(--menu-surface-foreground)] dark:text-[color:var(--menu-surface-foreground-dark)]"
                >
                  <div className="grid gap-3 lg:grid-cols-2">
                    {category.items.map((item) => (
                      <article
                        key={item.key}
                        className={cn(
                          'rounded-2xl border px-4 py-3 shadow-sm transition hover:shadow-md',
                          'border-[color:var(--menu-border-color)] bg-[color:var(--menu-surface)] text-[color:var(--menu-surface-foreground)] hover:bg-[color:var(--menu-surface-hover)] dark:border-[color:var(--menu-border-color-dark)] dark:bg-[color:var(--menu-surface-dark)] dark:text-[color:var(--menu-surface-foreground-dark)] dark:hover:bg-[color:var(--menu-surface-hover-dark)]'
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-base font-semibold tracking-tight">
                            {item.name}
                          </h3>
                          {item.price ? (
                            <span className="text-sm font-semibold text-[color:var(--menu-price)] dark:text-[color:var(--menu-price-dark)]">
                              {item.price}
                            </span>
                          ) : null}
                        </div>
                        {item.description ? (
                          <p className="mt-2 text-sm text-[color:var(--menu-muted)] dark:text-[color:var(--menu-muted-dark)]">
                            {item.description}
                          </p>
                        ) : null}
                        {item.dietary.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.dietary.map((tag) => (
                              <span
                                key={`${item.key}-${tag}`}
                                className="rounded-full px-2 py-1 text-xs font-medium bg-[color:var(--menu-badge-bg)] text-[color:var(--menu-badge-text)] dark:bg-[color:var(--menu-badge-bg-dark)] dark:text-[color:var(--menu-badge-text-dark)]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SectionContainer>
  );
}
