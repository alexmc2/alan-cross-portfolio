import { defineField, defineType } from "sanity";
import { Film } from "lucide-react";

export default defineType({
  name: "portfolioItem",
  title: "Portfolio Item",
  type: "document",
  icon: Film,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "AI Video", value: "AI Video" },
          { title: "Short Film", value: "Short Film" },
          { title: "Aerial", value: "Aerial" },
          { title: "Animation", value: "Animation" },
          { title: "Sound", value: "Sound" },
          { title: "Other", value: "Other" },
        ],
      },
    }),
    defineField({
      name: "vimeoUrl",
      title: "Vimeo URL",
      description: "Link to the Vimeo video",
      type: "url",
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      description: "Image shown in the portfolio grid",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Description",
      description: "Short description shown on hover",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      description: "Featured items span full width in the grid",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Order",
      description: "Manual sort order (lower numbers appear first)",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Manual Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "thumbnail",
    },
  },
});
