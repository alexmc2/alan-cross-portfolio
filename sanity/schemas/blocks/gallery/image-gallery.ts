// sanity/schemas/blocks/gallery/image-gallery.ts
import { defineArrayMember, defineField, defineType } from "sanity";
import { Images } from "lucide-react";

export default defineType({
  name: "image-gallery",
  title: "Image Gallery",
  type: "object",
  icon: Images,
  description: "Display a masonry image gallery with a lightbox carousel.",
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
      name: "heading",
      type: "string",
      title: "Heading",
      description: "Optional heading shown above the gallery",
      validation: (rule) =>
        rule
          .max(120)
          .warning("Keep headings under 120 characters so they fit on one line."),
    }),
    defineField({
      name: "intro",
      type: "text",
      title: "Intro",
      rows: 3,
      description: "Optional short description displayed above the gallery.",
      validation: (rule) =>
        rule
          .max(280)
          .warning("Aim for short introductions no longer than a tweet."),
    }),
    defineField({
      name: "desktopColumns",
      type: "string",
      title: "Desktop Columns",
      description: "Choose how many columns to show on large screens.",
      options: {
        list: [
          { title: "Three columns", value: "three" },
          { title: "Two columns", value: "two" },
        ],
        layout: "radio",
      },
      initialValue: "three",
    }),
    defineField({
      name: "dateOrder",
      type: "string",
      title: "Image Order",
      description: "Sort images by upload date before displaying them.",
      options: {
        list: [
          { title: "Newest first", value: "desc" },
          { title: "Oldest first", value: "asc" },
        ],
        layout: "radio",
      },
      initialValue: "desc",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alternative Text",
              description: "Describe the image for screen readers.",
              validation: (rule) =>
                rule
                  .required()
                  .error("Alternative text is required for accessibility."),
            }),
            defineField({
              name: "caption",
              type: "string",
              title: "Caption",
              description: "Optional caption shown below the image in the lightbox.",
              validation: (rule) =>
                rule
                  .max(160)
                  .warning("Keep captions under 160 characters."),
            }),
          ],
        }),
      ],
      validation: (rule) =>
        rule
          .min(1)
          .error("Add at least one image before publishing this gallery."),
    }),
  ],
  preview: {
    select: {
      heading: "heading",
      images: "images",
    },
    prepare({ heading, images }) {
      const count = images?.length ?? 0;
      return {
        title: heading || "Image Gallery",
        subtitle: count > 0 ? `${count} image${count === 1 ? "" : "s"}` : "No images selected",
      };
    },
  },
});
