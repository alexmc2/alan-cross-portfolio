import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { fontDisplay, fontBody } from "@/lib/fonts";
import { projectId } from "@/sanity/env";

const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";
const fallbackSiteUrl = "http://localhost:3000";

const metadataBase = (() => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  try {
    return new URL(siteUrl ?? fallbackSiteUrl);
  } catch {
    return new URL(fallbackSiteUrl);
  }
})();

export const metadata: Metadata = {
  metadataBase,
  title: {
    template: "%s | Alan Cross",
    default: "Alan Cross | AI Film & Video Production",
  },
  description:
    "Screenwriter, filmmaker and AI generative video producer. Creating exceptional content using both traditional production and AI-driven workflows.",
  openGraph: {
    title: "Alan Cross | AI Film & Video Production",
    description:
      "Screenwriter, filmmaker and AI generative video producer. Creating exceptional content using both traditional production and AI-driven workflows.",
    locale: "en_GB",
    type: "website",
  },
  robots: !isProduction ? "noindex, nofollow" : "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sanityCdnOrigin = "https://cdn.sanity.io";
  const sanityApiOrigin = `https://${projectId}.api.sanity.io`;

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="preconnect"
          href={sanityCdnOrigin}
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href={sanityApiOrigin}
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href={sanityCdnOrigin} />
        <link rel="dns-prefetch" href={sanityApiOrigin} />
      </head>
      <body className={`${fontDisplay.variable} ${fontBody.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
