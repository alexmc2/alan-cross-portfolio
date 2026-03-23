import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { fontDisplay, fontBody } from '@/lib/fonts';
import { projectId } from '@/sanity/env';
import { isIndexableSite, metadataBase, siteUrl } from '@/lib/siteConfig';

export const metadata: Metadata = {
  metadataBase,
  title: {
    template: '%s | Alan Cross',
    default: 'Alan Cross | AI Film & Video Production',
  },
  description:
    'Screenwriter, filmmaker and AI generative video producer. Creating exceptional content using both traditional production and AI-driven workflows.',
  openGraph: {
    title: 'Alan Cross | AI Film & Video Production',
    description:
      'Screenwriter, filmmaker and AI generative video producer. Creating exceptional content using both traditional production and AI-driven workflows.',
    locale: 'en_GB',
    type: 'website',
    url: siteUrl,
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
    <html lang="en">
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-white focus:px-4 focus:py-2 focus:text-black"
        >
          Skip to content
        </a>
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
