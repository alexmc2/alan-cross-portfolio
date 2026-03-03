// sanity/lib/fetch.ts
import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries/siteSettings";
import { PORTFOLIO_ITEMS_QUERY } from "@/sanity/queries/portfolioItem";
import { SERVICES_QUERY } from "@/sanity/queries/service";
import { SOCIAL_LINKS_QUERY } from "@/sanity/queries/socialLink";
import {
  PAGE_QUERY,
  PAGES_SLUGS_QUERY,
} from "@/sanity/queries/page";
import {
  POST_QUERY,
  POSTS_QUERY,
  POSTS_SLUGS_QUERY,
} from "@/sanity/queries/post";

export const fetchSiteSettings = async () => {
  const { data } = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
  });
  return data;
};

export const fetchPortfolioItems = async () => {
  const { data } = await sanityFetch({
    query: PORTFOLIO_ITEMS_QUERY,
  });
  return data;
};

export const fetchServices = async () => {
  const { data } = await sanityFetch({
    query: SERVICES_QUERY,
  });
  return data;
};

export const fetchSocialLinks = async () => {
  const { data } = await sanityFetch({
    query: SOCIAL_LINKS_QUERY,
  });
  return data;
};

export const fetchSanityPosts = async () => {
  const { data } = await sanityFetch({
    query: POSTS_QUERY,
  });
  return data;
};

export const fetchSanityPostBySlug = async ({
  slug,
}: {
  slug: string;
}) => {
  const { data } = await sanityFetch({
    query: POST_QUERY,
    params: { slug },
  });
  return data;
};

export const fetchSanityPostsStaticParams = async () => {
  const { data } = await sanityFetch({
    query: POSTS_SLUGS_QUERY,
    perspective: "published",
    stega: false,
  });
  return data;
};

export const fetchSanityPageBySlug = async ({
  slug,
}: {
  slug: string;
}) => {
  const { data } = await sanityFetch({
    query: PAGE_QUERY,
    params: { slug },
  });
  return data;
};

export const fetchSanityPagesStaticParams = async () => {
  const { data } = await sanityFetch({
    query: PAGES_SLUGS_QUERY,
    perspective: "published",
    stega: false,
  });
  return data;
};
