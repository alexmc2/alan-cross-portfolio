import type { Metadata } from 'next';
import { siteUrl } from '@/lib/siteConfig';
import { urlFor } from '@/sanity/lib/image';
import type { SiteSettings } from '@/types';

export const SITE_NAME = 'Alan Cross';

const DEFAULT_SITE_TITLE = 'Alan Cross | AI Film & Video Production';
const DEFAULT_SITE_DESCRIPTION =
  'Screenwriter, filmmaker and AI generative video producer. Creating exceptional content using both traditional production and AI-driven workflows.';

type SocialImageSource = {
  _type?: string | null;
  asset?: {
    _id?: string | null;
    url?: string | null;
    metadata?: {
      dimensions?: {
        width?: number | null;
        height?: number | null;
      } | null;
    } | null;
  } | null;
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  } | null;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  } | null;
};

type BuildMetadataOptions = {
  title: string;
  description?: string | null;
  canonicalPath?: string;
  image?: SocialImageSource | null;
  noindex?: boolean | null;
  type?: 'website' | 'article';
  publishedTime?: string;
};

export function resolveSiteTitle(settings?: SiteSettings | null) {
  return settings?.siteTitle?.trim() || DEFAULT_SITE_TITLE;
}

export function resolveSiteDescription(
  settings?: Pick<SiteSettings, 'siteDescription'> | null
) {
  return settings?.siteDescription?.trim() || DEFAULT_SITE_DESCRIPTION;
}

export function buildCanonicalUrl(pathname = '/') {
  return new URL(pathname, siteUrl).toString();
}

export function resolveSocialImages(
  image?: SocialImageSource | null,
  alt = SITE_NAME
) {
  const sourceUrl = image?.asset?.url;

  if (!sourceUrl) {
    return undefined;
  }

  const isWebpAsset = sourceUrl.toLowerCase().includes('.webp');
  const width = isWebpAsset
    ? 1200
    : image.asset?.metadata?.dimensions?.width ?? 1200;
  const height = isWebpAsset
    ? 630
    : image.asset?.metadata?.dimensions?.height ?? 630;

  const url = isWebpAsset
    ? urlFor(image)
        .width(width)
        .height(height)
        .format('jpg')
        .url()
    : sourceUrl;

  return [
    {
      url,
      width,
      height,
      alt,
    },
  ];
}

export function buildMetadata({
  title,
  description,
  canonicalPath = '/',
  image,
  noindex,
  type = 'website',
  publishedTime,
}: BuildMetadataOptions): Metadata {
  const canonicalUrl = buildCanonicalUrl(canonicalPath);
  const images = resolveSocialImages(image, title);

  return {
    title,
    description: description || undefined,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description: description || undefined,
      type,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'en_GB',
      ...(publishedTime ? { publishedTime } : {}),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: images ? 'summary_large_image' : 'summary',
      title,
      description: description || undefined,
      ...(images ? { images: images.map(({ url }) => url) } : {}),
    },
    robots: noindex ? 'noindex, nofollow' : undefined,
  };
}
