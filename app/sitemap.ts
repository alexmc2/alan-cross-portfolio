import { MetadataRoute } from 'next';
import { groq } from 'next-sanity';
import { siteUrl } from '@/lib/siteConfig';
import { sanityFetch } from '@/sanity/lib/live';

async function getPostsSitemap(
  baseUrl: string,
): Promise<MetadataRoute.Sitemap> {
  const postsQuery = groq`
    *[_type == 'post'] | order(_updatedAt desc) {
      'url': $baseUrl + '/blog/' + slug.current,
      'lastModified': _updatedAt,
      'changeFrequency': 'weekly',
      'priority': 0.7
    }
  `;

  const { data } = await sanityFetch({
    query: postsQuery,
    params: { baseUrl },
  });

  return data;
}

async function getPagesSitemap(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const pagesQuery = groq`
    *[
      _type == 'page' &&
      defined(slug.current) &&
      slug.current != 'index' &&
      slug.current != 'blog' &&
      slug.current != 'studio' &&
      slug.current != 'api'
    ] | order(_updatedAt desc) {
      'url': $baseUrl + '/' + slug.current,
      'lastModified': _updatedAt,
      'changeFrequency': 'weekly',
      'priority': 0.6
    }
  `;

  const { data } = await sanityFetch({
    query: pagesQuery,
    params: { baseUrl },
  });

  return data;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl;
  const [pages, posts] = await Promise.all([getPagesSitemap(baseUrl), getPostsSitemap(baseUrl)]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  return [...staticPages, ...pages, ...posts];
}
