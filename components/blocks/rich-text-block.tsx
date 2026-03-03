// components/blocks/rich-text-block.tsx
import SectionContainer from "@/components/ui/section-container";
import PortableTextRenderer from "@/components/portable-text-renderer";
import {
  getRichTextContainerClass,
  type RichTextStyleOptions,
} from "@/lib/styles/rich-text";
import type { PortableTextProps } from "@portabletext/react";
import { stegaClean } from "next-sanity";

import type {
  ColorVariant,
  PAGE_QUERYResult,
  SectionPadding,
} from "@/sanity.types";

type PageBlock = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type QueryRichTextBlock = Extract<PageBlock, { _type: "rich-text-block" }>;
type RichTextBody = QueryRichTextBlock["body"];

export type RichTextBlockProps = {
  _type: "rich-text-block";
  _key: string;
  padding?: SectionPadding | null;
  colorVariant?: ColorVariant | null;
  colorVariantDark?: ColorVariant | null;
  contentWidth?: RichTextStyleOptions["contentWidth"] | null;
  textAlign?: RichTextStyleOptions["textAlign"] | null;
  fontFamily?: RichTextStyleOptions["fontFamily"] | null;
  fontSize?: RichTextStyleOptions["fontSize"] | null;
  textColorVariant?: RichTextStyleOptions["textColor"] | null;
  spacing?: RichTextStyleOptions["spacing"] | null;
  body?: RichTextBody | null;
};

export type RichTextContentProps = Pick<
  RichTextBlockProps,
  | "body"
  | "contentWidth"
  | "textAlign"
  | "fontFamily"
  | "fontSize"
  | "textColorVariant"
  | "spacing"
  | "padding"
> & { context?: RichTextStyleOptions["context"] };

const sanitizeString = (value?: string | null) => {
  if (!value) {
    return undefined;
  }

  const cleaned = stegaClean(value);
  return cleaned || value;
};

export function RichTextContent({
  body,
  contentWidth,
  textAlign,
  fontFamily,
  fontSize,
  textColorVariant,
  spacing,
  padding,
  context = "standalone",
}: RichTextContentProps) {
  if (!body || body.length === 0) {
    return null;
  }

  const className = getRichTextContainerClass({
    contentWidth: sanitizeString(contentWidth) as RichTextStyleOptions["contentWidth"],
    textAlign: sanitizeString(textAlign) as RichTextStyleOptions["textAlign"],
    fontFamily: sanitizeString(fontFamily) as RichTextStyleOptions["fontFamily"],
    fontSize: sanitizeString(fontSize) as RichTextStyleOptions["fontSize"],
    textColor: sanitizeString(textColorVariant) as RichTextStyleOptions["textColor"],
    spacing: sanitizeString(spacing) as RichTextStyleOptions["spacing"],
    paddingTop: context === "inline" ? Boolean(padding?.top) : false,
    paddingBottom: context === "inline" ? Boolean(padding?.bottom) : false,
    context,
  });

  return (
    <div className={className}>
      <PortableTextRenderer
        value={body as PortableTextProps["value"]}
        spacing="none"
      />
    </div>
  );
}

export default function RichTextBlock({
  padding,
  colorVariant,
  colorVariantDark,
  contentWidth,
  textAlign,
  fontFamily,
  fontSize,
  textColorVariant,
  spacing,
  body,
}: RichTextBlockProps) {
  const color = sanitizeString(colorVariant) as ColorVariant | undefined;
  const colorDark = sanitizeString(colorVariantDark) as ColorVariant | undefined;

  return (
    <SectionContainer
      color={color ?? undefined}
      colorDark={colorDark ?? undefined}
      padding={padding}
    >
      <RichTextContent
        body={body}
        contentWidth={contentWidth}
        textAlign={textAlign}
        fontFamily={fontFamily}
        fontSize={fontSize}
        textColorVariant={textColorVariant}
        spacing={spacing}
        padding={padding}
        context="standalone"
      />
    </SectionContainer>
  );
}
