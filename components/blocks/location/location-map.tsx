// components/blocks/location/location-map.tsx
"use client";

import { useMemo } from "react";
import { stegaClean } from "next-sanity";

import SectionContainer from "@/components/ui/section-container";
import type { ColorVariant, SectionPadding } from "@/sanity.types";
import { cn } from "@/lib/utils";

const GOOGLE_MAPS_EMBED_BASE = "https://maps.google.com/maps";

export type LocationMapBlock = {
  _type: "location-map";
  _key: string;
  padding?: SectionPadding | null;
  colorVariant?: ColorVariant | null;
  heading?: string | null;
  headingAlignment?: "left" | "center" | "right" | null;
  locationLabel?: string | null;
  locationName?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  mapZoom?: number | null;
};

export type LocationMapLayout = "section" | "inline";

type LocationMapProps = LocationMapBlock & {
  layout?: LocationMapLayout;
};

const cleanString = (value?: string | null) =>
  value ? stegaClean(value) : undefined;

export default function LocationMap({
  padding,
  colorVariant,
  heading,
  headingAlignment,
  locationLabel,
  locationName,
  address,
  latitude,
  longitude,
  mapZoom,
  layout = "section",
}: LocationMapProps) {
  const cleanedColor =
    layout === "section" && colorVariant ? stegaClean(colorVariant) : undefined;
  const cleanedHeading = cleanString(heading);
  const headingAlignmentValue = (() => {
    if (!headingAlignment) {
      return "left" as const;
    }

    const alignment = stegaClean(headingAlignment);

    if (alignment === "center" || alignment === "right") {
      return alignment;
    }

    return "left" as const;
  })();
  const headingAlignClass =
    headingAlignmentValue === "center"
      ? "text-center"
      : headingAlignmentValue === "right"
        ? "text-right"
        : "text-left";
  const cleanedLabel = cleanString(locationLabel) ?? "Our location";
  const locationNameQuery = cleanString(locationName);
  const cleanedLocationName = locationNameQuery ?? "Location";
  const cleanedAddress = cleanString(address);

  const mapSrc = useMemo(() => {
    const queryTarget = (() => {
      if (typeof latitude === "number" && typeof longitude === "number") {
        return `${latitude},${longitude}`;
      }

      if (cleanedAddress) {
        return cleanedAddress;
      }

      if (locationNameQuery) {
        return locationNameQuery;
      }

      return null;
    })();

    if (!queryTarget) {
      return null;
    }

    const params = new URLSearchParams({ q: queryTarget, output: "embed" });

    if (typeof mapZoom === "number" && Number.isFinite(mapZoom)) {
      params.set("z", String(mapZoom));
    }

    return `${GOOGLE_MAPS_EMBED_BASE}?${params.toString()}`;
  }, [latitude, longitude, mapZoom, cleanedAddress, locationNameQuery]);

  const hasMap = Boolean(mapSrc);

  const wrapperClasses = cn(
    "space-y-6",
    layout === "section"
      ? "mx-auto max-w-4xl"
      : "w-full rounded-2xl border border-border/60 bg-background/80 p-6 shadow-sm backdrop-blur"
  );

  const mapHeightClass = layout === "inline" ? "h-64" : "h-[320px]";
  const detailsPaddingClass = layout === "inline" ? "space-y-3 p-5" : "space-y-3 p-6";

  const content = (
    <div className={wrapperClasses}>
      {cleanedHeading ? (
        <h2
          className={cn(
            headingAlignClass,
            "text-3xl font-semibold tracking-tight text-foreground"
          )}
        >
          {cleanedHeading}
        </h2>
      ) : null}
      <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
        {hasMap ? (
          <iframe
            title={cleanedLocationName || "Map"}
            src={mapSrc ?? undefined}
            width="100%"
            height="320"
            loading="lazy"
            allowFullScreen
            className={`${mapHeightClass} w-full`}
          />
        ) : (
          <div
            className={cn(
              "flex w-full items-center justify-center bg-muted text-sm font-medium text-muted-foreground",
              mapHeightClass
            )}
          >
            Add an address or coordinates to show the embedded map
          </div>
        )}
        <div className={detailsPaddingClass}>
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {cleanedLabel}
          </div>
          <div className="text-lg font-semibold text-foreground">{cleanedLocationName}</div>
          {cleanedAddress && (
            <p className="whitespace-pre-line text-base text-muted-foreground/90">
              {cleanedAddress}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (layout === "inline") {
    return <div className="flex h-full flex-col justify-center">{content}</div>;
  }

  return (
    <SectionContainer color={cleanedColor} padding={padding}>
      {content}
    </SectionContainer>
  );
}
