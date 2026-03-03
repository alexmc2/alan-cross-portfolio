// components/blocks/lottie-animation.tsx
import { stegaClean } from "next-sanity";
import { cn } from "@/lib/utils";
import SectionContainer from "@/components/ui/section-container";
import PortableTextRenderer from "@/components/portable-text-renderer";
import MenuLottie from "@/components/blocks/menu/menu-lottie";

import type { ColorVariant, PAGE_QUERYResult } from "@/sanity.types";
import type { CSSProperties } from "react";
import type { PortableTextBlock } from "@portabletext/types";

type LottieAnimationProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "lottie-animation" }
> & {
  animationDark?: {
    asset?: {
      url?: string | null;
    } | null;
  } | null;
  colorVariantDark?: ColorVariant | null;
};

type SpacingScale = "none" | "tight" | "compact" | "comfortable" | "roomy";

const ALIGN_CLASS_MAP: Record<"left" | "center" | "right", string> = {
  left: "ml-0 mr-auto",
  center: "mx-auto",
  right: "ml-auto mr-0",
};

const SIZE_CLASS_MAP: Record<"small" | "medium" | "large" | "full", string> = {
  small: "max-w-[14rem] sm:max-w-[18rem]",
  medium: "max-w-[20rem] sm:max-w-[28rem] md:max-w-[32rem]",
  large: "max-w-[32rem] sm:max-w-[40rem] md:max-w-[48rem]",
  full: "w-full max-w-none",
};

const HEIGHT_CLASS_MAP: Record<"small" | "medium" | "large" | "full", string> = {
  small: "h-24 sm:h-28",
  medium: "h-32 sm:h-40 md:h-48",
  large: "h-44 sm:h-52 md:h-64",
  full: "h-48 sm:h-60 md:h-72 lg:h-80",
};

const FILLED_SIZE_STYLE = {
  width: "100%",
  height: "100%",
} satisfies CSSProperties;

const STACK_GAP_CLASS_MAP: Record<SpacingScale, string> = {
  none: "gap-0",
  tight: "gap-3 md:gap-4",
  compact: "gap-4 md:gap-6",
  comfortable: "gap-6 md:gap-8",
  roomy: "gap-8 md:gap-12",
};

const TEXT_ALIGN_CLASS_MAP: Record<"left" | "center" | "right", string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const TOP_SPACING_CLASS_MAP: Record<SpacingScale, string> = {
  none: "pt-0",
  tight: "pt-3 md:pt-4",
  compact: "pt-6 md:pt-8",
  comfortable: "pt-10 md:pt-12",
  roomy: "pt-14 md:pt-16",
};

const BOTTOM_SPACING_CLASS_MAP: Record<SpacingScale, string> = {
  none: "pb-0",
  tight: "pb-3 md:pb-4",
  compact: "pb-6 md:pb-8",
  comfortable: "pb-10 md:pb-12",
  roomy: "pb-14 md:pb-16",
};

export default function LottieAnimationBlock({
  padding,
  colorVariant,
  colorVariantDark,
  sectionWidth,
  animationAlign,
  animationSize,
  verticalSpacing,
  animation,
  animationDark,
  ariaLabel,
  title,
  textOrientation,
  textPlacement,
  textSpacing,
}: LottieAnimationProps) {
  const resolvedColor = (stegaClean(colorVariant) || undefined) as
    | ColorVariant
    | undefined;
  const resolvedColorDark = (stegaClean(colorVariantDark) || undefined) as
    | ColorVariant
    | undefined;
  const width = stegaClean(sectionWidth);
  const align = (stegaClean(animationAlign) || "center") as
    | "left"
    | "center"
    | "right";
  const size = (stegaClean(animationSize) || "medium") as
    | "small"
    | "medium"
    | "large"
    | "full";
  const spacing = (stegaClean(verticalSpacing) || "compact") as SpacingScale;
  const hasTopPadding = Boolean(padding?.top);
  const hasBottomPadding = Boolean(padding?.bottom);
  const src = animation?.asset?.url || undefined;
  const srcDark = animationDark?.asset?.url || undefined;
  const label = (stegaClean(ariaLabel) || undefined) as string | undefined;
  const hasText = Array.isArray(title) && title.length > 0;
  const orientation = hasText
    ? ((stegaClean(textOrientation) || "vertical") as
        | "vertical"
        | "horizontal")
    : "vertical";
  const placement = hasText
    ? ((stegaClean(textPlacement) || "after") as "before" | "after")
    : "after";
  const textSpacingValue: SpacingScale = hasText
    ? ((stegaClean(textSpacing) || "compact") as SpacingScale)
    : "none";
  const stackGapClass = hasText
    ? STACK_GAP_CLASS_MAP[textSpacingValue]
    : STACK_GAP_CLASS_MAP.none;
  const isHorizontal = hasText && orientation === "horizontal";
  const textAlignClass = TEXT_ALIGN_CLASS_MAP[align];

  if (!src) {
    return null;
  }

  const renderText = () => {
    if (!hasText) {
      return null;
    }

    const wrapperClass = cn(
      "w-full",
      isHorizontal ? "mx-auto lg:mx-0 lg:flex-1 lg:max-w-xl" : ALIGN_CLASS_MAP[align],
      isHorizontal ? undefined : SIZE_CLASS_MAP[size],
      isHorizontal || size === "full" ? undefined : "w-full"
    );

    return (
      <div className={wrapperClass}>
        <div className={cn(textAlignClass, isHorizontal ? "lg:text-left" : undefined)}>
          <PortableTextRenderer
            value={(title as PortableTextBlock[] | undefined) ?? []}
          />
        </div>
      </div>
    );
  };

  const animationWrapperClass = cn(
    "w-full",
    SIZE_CLASS_MAP[size],
    size !== "full" ? "w-full" : undefined,
    isHorizontal
      ? "mx-auto lg:mx-0 lg:flex-1"
      : ALIGN_CLASS_MAP[align]
  );

  return (
    <SectionContainer
      color={resolvedColor}
      colorDark={resolvedColorDark}
      padding={padding}
      className={cn(
        !hasTopPadding ? TOP_SPACING_CLASS_MAP[spacing] : undefined,
        !hasBottomPadding ? BOTTOM_SPACING_CLASS_MAP[spacing] : undefined
      )}
    >
      <div className={cn("w-full", width === "narrow" ? "max-w-4xl mx-auto" : undefined)}>
        <div
          className={cn(
            "flex w-full flex-col",
            stackGapClass,
            isHorizontal ? "lg:flex-row lg:items-center" : undefined
          )}
        >
          {hasText && placement === "before" ? renderText() : null}
          <div className={animationWrapperClass}>
            <div
              className={cn(
                "relative flex w-full items-center justify-center overflow-hidden",
                HEIGHT_CLASS_MAP[size]
              )}
            >
              <MenuLottie
                src={src}
                srcDark={srcDark}
                className="h-full w-full"
                ariaLabel={label}
                style={FILLED_SIZE_STYLE}
                preserveAspectRatio="xMidYMid meet"
              />
            </div>
          </div>
          {hasText && placement === "after" ? renderText() : null}
        </div>
      </div>
    </SectionContainer>
  );
}
