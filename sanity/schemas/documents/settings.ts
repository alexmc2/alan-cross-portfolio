// sanity/schemas/documents/settings.ts
import { defineField, defineType } from "sanity";
import { Settings } from "lucide-react";

export default defineType({
  name: "settings",
  title: "Settings",
  type: "document",
  icon: Settings,
  fields: [
    defineField({
      name: "headerLogo",
      title: "Header logo",
      description: "Logo used in the site header and mobile navigation.",
      type: "object",
      fields: [
        defineField({
          name: "dark",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "light",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "width",
          type: "number",
          title: "Width",
          description:
            "Width in pixels. Defaults to the uploaded image dimensions.",
        }),
        defineField({
          name: "height",
          type: "number",
          title: "Height",
          description:
            "Height in pixels. Defaults to the uploaded image dimensions.",
        }),
      ],
    }),
    defineField({
      name: "footerLogo",
      title: "Footer logo",
      description: "Logo displayed in the global footer.",
      type: "object",
      fields: [
        defineField({
          name: "dark",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "light",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "width",
          type: "number",
          title: "Width",
          description:
            "Width in pixels. Defaults to the uploaded image dimensions.",
        }),
        defineField({
          name: "height",
          type: "number",
          title: "Height",
          description:
            "Height in pixels. Defaults to the uploaded image dimensions.",
        }),
      ],
    }),
    defineField({
      name: "showSiteNameInHeader",
      title: "Show site name in header",
      description:
        "Display the site name text when no header logo is provided.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "showSiteNameInFooter",
      title: "Show site name in footer",
      description:
        "Display the site name text when no footer logo is provided.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "siteName",
      type: "string",
      description: "The name of your site",
      validation: (Rule) => Rule.required().error("Site name is required"),
    }),
    defineField({
      name: "copyright",
      type: "block-content",
      description: "The copyright text to display in the footer",
    }),
  ],
  preview: {
    select: {
      title: "siteName",
      media: "headerLogo",
    },
    prepare({ title, media }) {
      return {
        title: title || "Site Settings",
        media,
      };
    },
  },
});
