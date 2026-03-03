// components/blocks/index.tsx
import type { ComponentType } from "react";

import type { PAGE_QUERYResult } from "@/sanity.types";
import type { ContactFormBlock } from "@/components/blocks/forms/contact-form";
import type { FormContactMapBlock } from "@/components/blocks/forms/contact-map";
import type { LocationMapBlock } from "@/components/blocks/location/location-map";
import type { RichTextBlockProps } from "@/components/blocks/rich-text-block";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type ExtendedBlock =
  | Block
  | ContactFormBlock
  | LocationMapBlock
  | FormContactMapBlock
  | RichTextBlockProps;

type BlockRenderers = {
  [K in ExtendedBlock["_type"]]: () => Promise<
    ComponentType<Extract<ExtendedBlock, { _type: K }>>
  >;
};

const componentLoaders = {
  "hero-1": () => import("@/components/blocks/hero/hero-1").then((mod) => mod.default),
  "hero-2": () => import("@/components/blocks/hero/hero-2").then((mod) => mod.default),
  "hero-full": () => import("@/components/blocks/hero/hero-full").then((mod) => mod.default),
  "section-header": () =>
    import("@/components/blocks/section-header").then((mod) => mod.default),
  "lottie-animation": () =>
    import("@/components/blocks/lottie-animation").then((mod) => mod.default),
  "split-row": () => import("@/components/blocks/split/split-row").then((mod) => mod.default),
  "grid-row": () => import("@/components/blocks/grid/grid-row").then((mod) => mod.default),
  "carousel-1": () =>
    import("@/components/blocks/carousel/carousel-1").then((mod) => mod.default),
  "carousel-2": () =>
    import("@/components/blocks/carousel/carousel-2").then((mod) => mod.default),
  "image-gallery": () =>
    import("@/components/blocks/gallery/image-gallery").then((mod) => mod.default),
  "reviews-carousel": () =>
    import("@/components/blocks/reviews/reviews-carousel").then((mod) => mod.default),
  "timeline-row": () =>
    import("@/components/blocks/timeline/timeline-row").then((mod) => mod.default),
  "cta-1": () => import("@/components/blocks/cta/cta-1").then((mod) => mod.default),
  "logo-cloud-1": () =>
    import("@/components/blocks/logo-cloud/logo-cloud-1").then((mod) => mod.default),
  faqs: () => import("@/components/blocks/faqs").then((mod) => mod.default),
  "form-newsletter": () =>
    import("@/components/blocks/forms/newsletter").then((mod) => mod.default),
  "form-contact": () =>
    import("@/components/blocks/forms/contact-form").then((mod) => mod.default),
  "form-contact-map": () =>
    import("@/components/blocks/forms/contact-map").then((mod) => mod.default),
  "location-map": () =>
    import("@/components/blocks/location/location-map").then((mod) => mod.default),
  "all-posts": () => import("@/components/blocks/all-posts").then((mod) => mod.default),
  "menu-section": () =>
    import("@/components/blocks/menu-section").then((mod) => mod.default),
  "menu-google-section": () =>
    import("@/components/blocks/menu/google-menu-section").then((mod) => mod.default),
  "rich-text-block": () =>
    import("@/components/blocks/rich-text-block").then((mod) => mod.default),
} satisfies BlockRenderers;

export default async function Blocks({ blocks }: { blocks: ExtendedBlock[] }) {
  const renderedBlocks = await Promise.all(
    (blocks ?? []).map(async (block) => {
      const loadComponent = componentLoaders[block._type];

      if (!loadComponent) {
        console.warn(`No component implemented for block type: ${block._type}`);
        return <div data-type={block._type} key={block._key} />;
      }

      const Component = await loadComponent();

      return <Component {...(block as any)} key={block._key} />;
    })
  );

  return <>{renderedBlocks}</>;
}
