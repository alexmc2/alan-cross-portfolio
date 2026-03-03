// sanity/schemas/blocks/hero/hero-full.ts
import { defineField, defineType } from "sanity";
import { Image as ImageIcon, SlidersHorizontal } from "lucide-react";

export default defineType({
  name: "hero-full",
  type: "object",
  title: "Hero – Full Image",
  icon: ImageIcon,
  groups: [
    { name: "content", title: "Content", icon: ImageIcon },
    { name: "settings", title: "Settings", icon: SlidersHorizontal },
  ],
  fields: [
    defineField({ name: "tagLine", type: "string", group: "content" }),
    defineField({ name: "title", type: "string", group: "content" }),
    defineField({ name: "body", type: "block-content", group: "content" }),
    defineField({
      name: "images",
      title: "Hero Images",
      type: "array",
      group: "content",
      description: "Add one or more images to rotate through in the hero carousel.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alternative Text",
              description:
                "Briefly describe the focus of the image for screen readers.",
              validation: (Rule) =>
                Rule.max(120).warning("Aim for alt text under 120 characters."),
            }),
          ],
        },
      ],
      validation: (Rule) =>
        Rule.custom((images, context) => {
          if (images?.length) return true;
          const parent = context.parent as { image?: unknown } | undefined;
          if (parent?.image) return true;
          return "Add at least one hero image.";
        }),
    }),
    defineField({
      name: "image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Briefly describe the focus of the image for screen readers.",
          validation: (Rule) =>
            Rule.max(120).warning("Aim for alt text under 120 characters."),
        }),
      ],
      hidden: ({ parent }) => Boolean(parent?.images && parent.images.length > 0),
    }),
    defineField({
      name: "height",
      title: "Height",
      type: "string",
      initialValue: "screen",
      options: {
        list: [
          { title: "Full Screen", value: "screen" },
          { title: "70vh", value: "70vh" },
          { title: "60vh", value: "60vh" },
        ],
        layout: "radio",
      },
      group: "settings",
    }),
    defineField({
      name: "overlay",
      title: "Dark Overlay",
      type: "boolean",
      initialValue: true,
      group: "settings",
    }),
    defineField({
      name: "initialHeaderVisible",
      title: "Show Header On Load",
      type: "boolean",
      description:
        "Keep the navigation bar solid while the hero is in view.",
      initialValue: false,
      group: "settings",
    }),
    defineField({
      name: "frosted",
      title: "Frosted Text Background",
      type: "boolean",
      description:
        "Blurred glass effect behind the hero text block.",
      initialValue: true,
      group: "settings",
    }),
    defineField({
      name: "overlayStrength",
      title: "Overlay Strength (0–100)",
      type: "number",
      group: "settings",
      initialValue: 50,
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: "contentAlignment",
      title: "Content Alignment",
      type: "string",
      initialValue: "center",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
      group: "settings",
    }),
  ],
  preview: {
    select: { title: "title", media: "image", gallery: "images.0" },
    prepare({ title, media, gallery }) {
      return {
        title: title || "Hero – Full Image",
        media: gallery || media,
      };
    },
  },
});
