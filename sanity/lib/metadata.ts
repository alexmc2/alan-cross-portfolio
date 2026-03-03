// sanity/lib/metadata.ts
import { urlFor } from '@/sanity/lib/image';
import { PAGE_QUERYResult, POST_QUERYResult } from '@/sanity.types';

const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === 'production';
const fallbackSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const siteDescription =
  'Portfolio website for Alan Cross. Fast, mobile-friendly, and easy to update.';
const siteTitle = 'Alan Cross Portfolio';
const siteLogoUrl = new URL('/demo-logo.svg', fallbackSiteUrl).toString();

export function generatePageMetadata({
  page,
  slug,
}: {
  page: PAGE_QUERYResult | POST_QUERYResult;
  slug: string;
}) {
  const rawMetaTitle = page?.meta_title?.trim();
  const documentTitle =
    typeof page === 'object' && page && 'title' in page
      ? (page as { title?: string | null }).title
      : null;
  const rawTitle =
    typeof documentTitle === 'string' ? documentTitle.trim() : null;
  const title = rawMetaTitle?.length ? rawMetaTitle : (rawTitle ?? siteTitle);

  const rawDescription = page?.meta_description?.trim();
  const description = rawDescription?.length ? rawDescription : siteDescription;

  const ogImageUrl = page?.ogImage
    ? urlFor(page.ogImage).quality(100).url()
    : `${fallbackSiteUrl}/images/og-image.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: page?.ogImage?.asset?.metadata?.dimensions?.width || 1200,
          height: page?.ogImage?.asset?.metadata?.dimensions?.height || 630,
        },
      ],
      locale: 'en_GB',
      type: 'website',
    },
    other: {
      'og:logo': siteLogoUrl,
    },
    robots: !isProduction
      ? 'noindex, nofollow'
      : page?.noindex
        ? 'noindex'
        : 'index, follow',
    alternates: {
      canonical: `/${slug === 'index' ? '' : slug}`,
    },
  };
}
