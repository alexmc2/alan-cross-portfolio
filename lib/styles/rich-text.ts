// lib/styles/rich-text.ts
import { cn } from "@/lib/utils";

type RichTextWidth = "narrow" | "default" | "wide" | "full";
type RichTextAlign = "left" | "center" | "right" | "justify";
type RichTextFontFamily = "sans" | "display" | "serif" | "mono";
type RichTextFontSize = "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
type RichTextSpacing = "compact" | "comfortable" | "spacious";
type RichTextColor =
  | "foreground"
  | "muted-foreground"
  | "accent"
  | "accent-foreground"
  | "primary"
  | "primary-foreground"
  | "secondary"
  | "secondary-foreground"
  | "white"
  | "black";

export type RichTextStyleOptions = {
  contentWidth?: RichTextWidth;
  textAlign?: RichTextAlign;
  fontFamily?: RichTextFontFamily;
  fontSize?: RichTextFontSize;
  textColor?: RichTextColor;
  paddingTop?: boolean;
  paddingBottom?: boolean;
  context?: "standalone" | "inline";
  spacing?: RichTextSpacing;
};

const widthClassMap: Record<RichTextWidth, string> = {
  narrow: "max-w-prose",
  default: "max-w-3xl",
  wide: "max-w-5xl",
  full: "max-w-none",
};

const textAlignClassMap: Record<RichTextAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

const fontFamilyClassMap: Record<RichTextFontFamily, string> = {
  sans: "font-sans",
  display: "font-[var(--font-display)]",
  serif: "font-serif",
  mono: "font-mono",
};

const fontSizeClassMap: Record<RichTextFontSize, string> = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
};

const textColorClassMap: Record<RichTextColor, string> = {
  foreground: "text-foreground",
  "muted-foreground": "text-muted-foreground",
  accent: "text-accent",
  "accent-foreground": "text-accent-foreground",
  primary: "text-primary",
  "primary-foreground": "text-primary-foreground",
  secondary: "text-secondary",
  "secondary-foreground": "text-secondary-foreground",
  white: "text-white",
  black: "text-black",
};

const spacingClassMap: Record<RichTextSpacing, { gap: string; leading: string }> = {
  compact: {
    gap: "gap-2 md:gap-3",
    leading: "leading-snug",
  },
  comfortable: {
    gap: "gap-6 md:gap-8",
    leading: "leading-relaxed",
  },
  spacious: {
    gap: "gap-8 md:gap-12",
    leading: "leading-loose",
  },
};

export const getRichTextContainerClass = ({
  contentWidth = "default",
  textAlign = "left",
  fontFamily = "sans",
  fontSize = "base",
  textColor = "foreground",
  paddingTop = false,
  paddingBottom = false,
  context = "standalone",
  spacing = "comfortable",
}: RichTextStyleOptions = {}) => {
  const widthClass = widthClassMap[contentWidth] ?? widthClassMap.default;
  const textAlignClass = textAlignClassMap[textAlign] ?? textAlignClassMap.left;
  const fontFamilyClass =
    fontFamilyClassMap[fontFamily] ?? fontFamilyClassMap.sans;
  const fontSizeClass = fontSizeClassMap[fontSize] ?? fontSizeClassMap.base;
  const textColorClass =
    textColorClassMap[textColor] ?? textColorClassMap.foreground;
  const spacingClasses = spacingClassMap[spacing] ?? spacingClassMap.comfortable;

  const shouldCenter = context === "standalone" && contentWidth !== "full";

  const inlinePaddingClasses =
    context === "inline"
      ? [
          paddingTop ? "pt-8 md:pt-10" : undefined,
          paddingBottom ? "pb-8 md:pb-10" : undefined,
        ]
      : [];

  return cn(
    "flex w-full flex-col",
    spacingClasses.gap,
    spacingClasses.leading,
    widthClass,
    fontFamilyClass,
    fontSizeClass,
    textAlignClass,
    textColorClass,
    shouldCenter ? "mx-auto" : undefined,
    ...inlinePaddingClasses
  );
};
