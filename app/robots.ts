import { MetadataRoute } from 'next';
import { isIndexableSite, siteUrl } from '@/lib/siteConfig';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        ...(isIndexableSite ? { allow: '/' } : { disallow: '/' }),
      },
    ],
    sitemap: [`${siteUrl}/sitemap.xml`],
  };
}
