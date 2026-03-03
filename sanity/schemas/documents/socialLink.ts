import { defineField, defineType } from "sanity";
import { Link } from "lucide-react";

export default defineType({
  name: "socialLink",
  title: "Social Link",
  type: "document",
  icon: Link,
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "LinkedIn", value: "LinkedIn" },
          { title: "Vimeo", value: "Vimeo" },
          { title: "YouTube", value: "YouTube" },
          { title: "SoundCloud", value: "SoundCloud" },
          { title: "Facebook", value: "Facebook" },
          { title: "Twitter/X", value: "Twitter/X" },
          { title: "Other", value: "Other" },
        ],
      },
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) => Rule.required(),
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
    select: { title: "platform", subtitle: "url" },
  },
});
