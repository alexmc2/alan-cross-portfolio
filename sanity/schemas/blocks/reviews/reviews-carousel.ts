// sanity/schemas/blocks/reviews/reviews-carousel.ts
import { defineField, defineType } from "sanity";
import { Star } from "lucide-react";

const MINIMUM_RATING_OPTIONS = [
  { title: "Show all ratings", value: "any" },
  { title: "3 stars and up", value: "3" },
  { title: "4 stars and up", value: "4" },
  { title: "5 star only", value: "5" },
];

const SORT_OPTIONS = [
  { title: "Most relevant", value: "most_relevant" },
  { title: "Newest", value: "newest" },
];

export default defineType({
  name: "reviews-carousel",
  title: "Reviews Carousel",
  type: "object",
  icon: Star,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
      description: "Control vertical spacing above and below the section.",
    }),
    defineField({
      name: "colorVariant",
      type: "color-variant",
      title: "Background",
      description: "Choose a background colour from the design system.",
    }),
    defineField({
      name: "sectionId",
      type: "string",
      title: "Section Anchor ID",
      description:
        "Optional anchor so navigation links can scroll to this section (e.g. reviews).",
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) {
            return true;
          }

          return /^[a-z0-9-]+$/.test(value)
            ? true
            : "Use lowercase letters, numbers, and hyphens only.";
        }),
    }),
    defineField({
      name: "eyebrow",
      type: "string",
      title: "Eyebrow",
      description: "Optional short label displayed above the main heading.",
    }),
    defineField({
      name: "heading",
      type: "string",
      title: "Heading",
      description: "Primary heading shown to visitors (e.g. Our Reviews).",
      validation: (rule) => rule.required().error("Add a heading so the section has context."),
    }),
    defineField({
      name: "intro",
      type: "text",
      title: "Intro Copy",
      rows: 3,
      description: "Optional supporting copy shown beneath the heading.",
    }),
    defineField({
      name: "placeId",
      type: "string",
      title: "Google Place ID",
      description:
        "Override the default Place ID from the environment. Leave blank to use the global setting.",
    }),
    defineField({
      name: "languageCode",
      type: "string",
      title: "Language Code",
      description: "ISO language code passed to Google (defaults to en-GB).",
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) {
            return true;
          }

          return /^[a-z]{2}(-[A-Z]{2})?$/.test(value)
            ? true
            : "Use locale formats like en or en-GB.";
        }),
    }),
    defineField({
      name: "maximumReviews",
      type: "number",
      title: "Maximum Reviews",
      description: "Total number of Google reviews to request (Google returns up to 10).",
      validation: (rule) =>
        rule
          .min(1)
          .max(10)
          .integer()
          .error("Choose between 1 and 10 reviews."),
      initialValue: 6,
    }),
    defineField({
      name: "minimumRating",
      type: "string",
      title: "Minimum Rating",
      description: "Filter reviews below the selected star rating.",
      options: {
        list: MINIMUM_RATING_OPTIONS,
        layout: "radio",
      },
      initialValue: "any",
    }),
    defineField({
      name: "sortOrder",
      type: "string",
      title: "Sort Order",
      description: "Display the newest reviews first or let Google decide relevance.",
      options: {
        list: SORT_OPTIONS,
        layout: "radio",
      },
      initialValue: "most_relevant",
    }),
    defineField({
      name: "cta",
      type: "link",
      title: "Call to Action",
      description: "Optional link to open the full reviews on Google.",
    }),
  ],
  preview: {
    select: {
      title: "heading",
    },
    prepare({ title }) {
      return {
        title: "Reviews Carousel",
        subtitle: title,
      };
    },
  },
});
