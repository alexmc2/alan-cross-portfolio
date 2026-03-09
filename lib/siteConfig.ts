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
const fallbackSiteUrl = "http://localhost:3000";
const explicitSiteEnv = process.env.NEXT_PUBLIC_SITE_ENV;
const vercelEnv = process.env.VERCEL_ENV;

export const siteUrl = envSiteUrl ?? vercelSiteUrl ?? fallbackSiteUrl;
export const metadataBase = new URL(siteUrl);

const isLocalSite = metadataBase.hostname === "localhost";

export const isProductionSite =
  vercelEnv != null
    ? vercelEnv === "production"
    : explicitSiteEnv != null
      ? explicitSiteEnv === "production"
      : process.env.NODE_ENV === "production" && !isLocalSite;

export const isIndexableSite = isProductionSite && !isLocalSite;
