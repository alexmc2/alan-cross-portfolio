import { defineField, defineType } from "sanity";
import { Briefcase } from "lucide-react";

export default defineType({
  name: "service",
  title: "Service",
  type: "document",
  icon: Briefcase,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      description: "A unicode character or emoji to display as the icon (e.g. ◆ ◎ △)",
      type: "string",
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
    select: { title: "title", subtitle: "description" },
  },
});
