// sanity/schemas/blocks/rich-text-block.ts
import { defineField, defineType } from "sanity";
import { FileText } from "lucide-react";

import {
  RICH_TEXT_FONT_FAMILY,
  RICH_TEXT_FONT_SIZE,
  RICH_TEXT_TEXT_ALIGN,
  RICH_TEXT_WIDTH,
  RICH_TEXT_TEXT_COLOR,
  RICH_TEXT_SPACING,
} from "./shared/layout-variants";

export default defineType({
  name: "rich-text-block",
  type: "object",
  title: "Rich Text",
  icon: FileText,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "colorVariant",
      type: "color-variant",
      title: "Color Variant",
      description: "Select a background color variant",
    }),
    defineField({
      name: "colorVariantDark",
      type: "color-variant",
      title: "Dark Mode Color Variant",
      description:
        "Optional override used when the site is viewed in dark mode.",
    }),
    defineField({
      name: "contentWidth",
      type: "string",
      title: "Content Width",
      options: {
        list: RICH_TEXT_WIDTH.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "default",
    }),
    defineField({
      name: "textAlign",
      type: "string",
      title: "Text Alignment",
      options: {
        list: RICH_TEXT_TEXT_ALIGN.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "left",
    }),
    defineField({
      name: "fontFamily",
      type: "string",
      title: "Font Family",
      options: {
        list: RICH_TEXT_FONT_FAMILY.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "sans",
    }),
    defineField({
      name: "fontSize",
      type: "string",
      title: "Base Font Size",
      options: {
        list: RICH_TEXT_FONT_SIZE.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "base",
    }),
    defineField({
      name: "spacing",
      type: "string",
      title: "Vertical Spacing",
      options: {
        list: RICH_TEXT_SPACING.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "comfortable",
    }),
    defineField({
      name: "textColorVariant",
      type: "string",
      title: "Text Color",
      options: {
        list: RICH_TEXT_TEXT_COLOR.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "foreground",
    }),
    defineField({
      name: "body",
      type: "block-content",
      validation: (rule) =>
        rule.required().error("Add rich text content before publishing."),
    }),
  ],
  preview: {
    select: {
      body: "body",
    },
    prepare({ body }) {
      const blocks = Array.isArray(body) ? body : [];

      type PortableTextChild = { text?: string };
      type PortableTextBlock = {
        _type?: string;
        children?: PortableTextChild[];
      };

      let previewText = "";

      for (const block of blocks as PortableTextBlock[]) {
        if (block?._type !== "block" || !Array.isArray(block.children)) {
          continue;
        }

        previewText = block.children
          .map((child) => (typeof child?.text === "string" ? child.text : ""))
          .join("");

        if (previewText) {
          break;
        }
      }

      return {
        title: "Rich Text",
        subtitle: previewText ? previewText.slice(0, 80) : "Add content",
      };
    },
  },
});
