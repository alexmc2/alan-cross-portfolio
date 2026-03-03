// components/blocks/gallery/image-gallery.tsx
import SectionContainer from "@/components/ui/section-container";
import { stegaClean } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import type { PAGE_QUERYResult } from "@/sanity.types";
import GalleryClient from "./gallery-client";

export type GalleryImageItem = {
  id: string;
  alt: string;
  caption?: string;
  gridSrc: string;
  modalSrc: string;
  blurDataUrl?: string | null;
  width: number;
  height: number;
};

export type GalleryDesktopColumns = "two" | "three";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type ImageGalleryBlock = Extract<Block, { _type: "image-gallery" }>;

const GRID_TARGET_WIDTH = 900;
const MODAL_TARGET_WIDTH = 1800;

export default function ImageGallery({
  padding,
  colorVariant,
  heading,
  intro,
  images,
  desktopColumns,
  dateOrder,
}: ImageGalleryBlock) {
  const color = stegaClean(colorVariant);
  const cleanHeading = heading ? stegaClean(heading) : null;
  const cleanIntro = intro ? stegaClean(intro) : null;

  type BlockImage = NonNullable<ImageGalleryBlock["images"]>[number];

  const parseTimestamp = (value?: string | null) => {
    if (!value) {
      return null;
    }

    const timestamp = Date.parse(value);
    return Number.isNaN(timestamp) ? null : timestamp;
  };

  const imageEntries = (Array.isArray(images) ? images : [])
    .map((image, index) => {
      if (!image || !image.asset?._id) {
        return null;
      }

      const asset = image.asset!;

      return {
        image: image as BlockImage,
        index,
        createdAt: parseTimestamp(asset._createdAt),
      };
    })
    .filter((entry): entry is {
      image: BlockImage;
      index: number;
      createdAt: number | null;
    } => entry !== null);

  const order = stegaClean(dateOrder) === "asc" ? "asc" : "desc";

  const sortedEntries = [...imageEntries].sort((a, b) => {
    if (a.createdAt !== null && b.createdAt !== null) {
      return order === "asc"
        ? a.createdAt - b.createdAt
        : b.createdAt - a.createdAt;
    }

    if (a.createdAt !== null) {
      return order === "asc" ? -1 : 1;
    }

    if (b.createdAt !== null) {
      return order === "asc" ? 1 : -1;
    }

    return a.index - b.index;
  });

  const galleryImages = sortedEntries.reduce<GalleryImageItem[]>((acc, entry, fallbackIndex) => {
    const { image } = entry;
    const asset = image.asset;

    if (!asset) {
      return acc;
    }

    const dimensions = asset.metadata?.dimensions;
    const width = Math.round(dimensions?.width ?? GRID_TARGET_WIDTH);
    const height = Math.round(dimensions?.height ?? GRID_TARGET_WIDTH);

    const gridUrl = urlFor(image)
      .width(GRID_TARGET_WIDTH)
      .fit("max")
      .quality(75)
      .url();

    const modalUrl = urlFor(image)
      .width(MODAL_TARGET_WIDTH)
      .fit("max")
      .quality(85)
      .url();

    if (!gridUrl || !modalUrl) {
      return acc;
    }

    acc.push({
      id: image._key ?? `image-${fallbackIndex}`,
      alt: stegaClean(image.alt) ?? "Gallery image",
      caption: image.caption ? stegaClean(image.caption) : undefined,
      gridSrc: gridUrl,
      modalSrc: modalUrl,
      blurDataUrl: asset.metadata?.lqip ?? null,
      width,
      height,
    });

    return acc;
  }, []);

  const columns: GalleryDesktopColumns =
    stegaClean(desktopColumns) === "two" ? "two" : "three";

  if (galleryImages.length === 0) {
    return null;
  }

  return (
    <SectionContainer color={color} padding={padding}>
      <div className="">
        {(cleanHeading || cleanIntro) && (
          <div className="mx-auto mb-10 text-center">
            {cleanHeading && (
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {cleanHeading}
              </h2>
            )}
            {cleanIntro && (
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                {cleanIntro}
              </p>
            )}
          </div>
        )}
        <GalleryClient images={galleryImages} desktopColumns={columns} />
      </div>
    </SectionContainer>
  );
}
