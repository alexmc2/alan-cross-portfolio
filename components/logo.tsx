// components/logo.tsx
"use client";

import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { useTheme } from "next-themes";
import { useMemo, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

type LogoVariant = "header" | "footer";

type LogoAsset = {
  asset?: {
    metadata?: {
      lqip?: string;
      dimensions?: {
        width?: number;
        height?: number;
      };
    };
    mimeType?: string;
  };
};

type LogoGroup = {
  light?: LogoAsset;
  dark?: LogoAsset;
  width?: number;
  height?: number;
};

type LogoSettings = {
  headerLogo?: LogoGroup;
  footerLogo?: LogoGroup;
  showSiteNameInHeader?: boolean;
  showSiteNameInFooter?: boolean;
  siteName?: string;
};

type LogoProps = {
  settings: LogoSettings;
  variant?: LogoVariant;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
  loading?: "eager" | "lazy";
  alt?: string;
  ariaHidden?: boolean;
};

export default function Logo({
  settings,
  variant = "header",
  className,
  sizes,
  priority,
  fetchPriority,
  loading,
  alt,
  ariaHidden,
}: LogoProps) {
  const { resolvedTheme } = useTheme();
  const hasHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // During SSR or before hydration, use dark mode as the site default
  const themeToUse = hasHydrated ? resolvedTheme : "dark";

  // Select the appropriate logo based on resolved theme (handles "system" correctly)
  const logoGroup = useMemo(() => {
    if (!settings) return undefined;
    return variant === "footer"
      ? settings?.footerLogo
      : settings?.headerLogo;
  }, [settings, variant]);

  const selectedLogo = logoGroup?.[
    themeToUse === "dark" ? "dark" : "light"
  ];

  // If no logo for the current theme, try the opposite theme as fallback
  const fallbackLogo =
    logoGroup?.[themeToUse === "dark" ? "light" : "dark"];
  const logoToUse = selectedLogo || fallbackLogo;

  const shouldRenderFallback =
    (variant === "footer"
      ? settings?.showSiteNameInFooter
      : settings?.showSiteNameInHeader) ?? true;

  const width =
    (logoGroup?.width as number | undefined) ??
    logoToUse?.asset?.metadata?.dimensions?.width ??
    100;
  const height =
    (logoGroup?.height as number | undefined) ??
    logoToUse?.asset?.metadata?.dimensions?.height ??
    40;

  const logoClass = cn(
    variant === "header" ? "pointer-events-none" : undefined,
    className
  );

  const fallbackClass = cn(
    "text-lg font-semibold tracking-tighter",
    variant === "header" ? "pointer-events-none" : undefined,
    className
  );

  if (logoToUse) {
    const altText = alt ?? settings?.siteName ?? "";
    return (
      <Image
        src={urlFor(logoToUse).url()}
        alt={altText}
        width={width}
        height={height}
        title={settings?.siteName || ""}
        placeholder={
          logoToUse?.asset?.metadata?.lqip &&
          logoToUse?.asset?.mimeType !== "image/svg+xml"
            ? "blur"
            : undefined
        }
        blurDataURL={logoToUse?.asset?.metadata?.lqip || undefined}
        className={logoClass}
        sizes={sizes}
        priority={priority}
        fetchPriority={fetchPriority}
        loading={loading}
        aria-hidden={ariaHidden ?? undefined}
      />
    );
  }

  if (!shouldRenderFallback) {
    return null;
  }

  return (
    <span className={fallbackClass}>
      {settings?.siteName || "Logo"}
    </span>
  );
}
