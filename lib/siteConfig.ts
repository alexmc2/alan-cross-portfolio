// lib/siteConfig.ts
const normalizeSiteUrl = (value?: string | null) => {
  if (!value || value.trim() === "") {
    return null;
  }

  const urlValue = value.startsWith("http") ? value : `https://${value}`;

  try {
    const url = new URL(urlValue);
    return url.origin;
  } catch {
    return null;
  }
};

const envSiteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
const vercelSiteUrl = normalizeSiteUrl(process.env.VERCEL_URL);

export const siteUrl = envSiteUrl ?? vercelSiteUrl ?? "http://localhost:3000";

