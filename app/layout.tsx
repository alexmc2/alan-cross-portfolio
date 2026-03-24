import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { fontDisplay, fontBody } from '@/lib/fonts';
import { projectId } from '@/sanity/env';
import { isIndexableSite, metadataBase } from '@/lib/siteConfig';
import {
  SITE_NAME,
  resolveSiteDescription,
  resolveSiteTitle,
  resolveSocialImages,
  buildCanonicalUrl,
} from '@/lib/metadata';
import { fetchSiteSettingsMetadata } from '@/sanity/lib/fetch';
import { ThemeProvider } from '@/components/theme-provider';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSiteSettingsMetadata();
  const title = resolveSiteTitle(settings);
  const description = resolveSiteDescription(settings);
  const images = resolveSocialImages(settings?.ogImage, title);

  return {
    metadataBase,
    title: {
      template: `%s | ${SITE_NAME}`,
      default: title,
    },
    description,
    openGraph: {
      title,
      description,
      locale: 'en_GB',
      type: 'website',
      url: buildCanonicalUrl('/'),
      siteName: SITE_NAME,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: images ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(images ? { images: images.map(({ url }) => url) } : {}),
    },
    alternates: {
      canonical: '/',
    },
    robots: isIndexableSite
      ? {
          index: true,
          follow: true,
        }
      : {
          index: false,
          follow: false,
        },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sanityCdnOrigin = 'https://cdn.sanity.io';
  const cloudinaryOrigin = 'https://res.cloudinary.com';
  const vimeoPlayerOrigin = 'https://player.vimeo.com';
  const dnsPrefetchOrigins = [
    `https://${projectId}.api.sanity.io`,
    cloudinaryOrigin,
    'https://player.vimeo.com',
    'https://i.vimeocdn.com',
    'https://vumbnail.com',
    'https://www.youtube-nocookie.com',
    'https://i.ytimg.com',
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/images/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href={sanityCdnOrigin} crossOrigin="anonymous" />
        <link rel="preconnect" href={cloudinaryOrigin} crossOrigin="anonymous" />
        <link rel="preconnect" href={vimeoPlayerOrigin} crossOrigin="anonymous" />
        {dnsPrefetchOrigins.map((origin) => (
          <link key={origin} rel="dns-prefetch" href={origin} />
        ))}
      </head>
      <body className={`${fontDisplay.variable} ${fontBody.variable}`}>
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:border focus:border-border focus:bg-bg-card focus:px-4 focus:py-2 focus:text-text-primary"
          >
            Skip to content
          </a>
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
