// sanity/schemas/blocks/lottie-animation.ts
import { defineField, defineType } from "sanity";
import { Sparkle } from "lucide-react";
import { LOTTIE_SIZE, MEDIA_ALIGN, SECTION_WIDTH } from "./shared/layout-variants";

export default defineType({
  name: "lottie-animation",
  type: "object",
  title: "Lottie Animation",
  description: "Display a standalone Lottie animation with layout controls.",
  icon: Sparkle,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "colorVariant",
      type: "color-variant",
      title: "Color Variant",
      description: "Select a background color variant.",
    }),
    defineField({
      name: "colorVariantDark",
      type: "color-variant",
      title: "Dark Mode Color Variant",
      description: "Optional override used when the site is viewed in dark mode.",
    }),
    defineField({
      name: "sectionWidth",
      type: "string",
      title: "Section Width",
      options: {
        list: SECTION_WIDTH.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "default",
    }),
    defineField({
      name: "animationAlign",
      type: "string",
      title: "Animation Alignment",
      description: "Control whether the animation hugs the left, right, or center.",
      options: {
        list: MEDIA_ALIGN.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "center",
    }),
    defineField({
      name: "verticalSpacing",
      type: "string",
      title: "Vertical Spacing",
      description: "Adjust default padding above and below the animation without toggles.",
      options: {
        list: [
          { title: "None", value: "none" },
          { title: "Tight", value: "tight" },
          { title: "Compact", value: "compact" },
          { title: "Comfortable", value: "comfortable" },
          { title: "Roomy", value: "roomy" },
        ],
        layout: "radio",
      },
      initialValue: "compact",
    }),
    defineField({
      name: "animationSize",
      type: "string",
      title: "Animation Size",
      description: "Adjust the rendered width of the animation.",
      options: {
        list: LOTTIE_SIZE.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "medium",
    }),
    defineField({
      name: "title",
      type: "block-content",
      title: "Title",
      description: "Optional rich text displayed with the animation.",
    }),
    defineField({
      name: "textOrientation",
      type: "string",
      title: "Text Orientation",
      description: "Stack the title vertically or align it horizontally beside the animation.",
      options: {
        list: [
          { title: "Vertical", value: "vertical" },
          { title: "Horizontal", value: "horizontal" },
        ],
        layout: "radio",
      },
      initialValue: "vertical",
    }),
    defineField({
      name: "textPlacement",
      type: "string",
      title: "Text Placement",
      description: "Control whether the title appears before or after the animation.",
      options: {
        list: [
          { title: "Before Animation", value: "before" },
          { title: "After Animation", value: "after" },
        ],
        layout: "radio",
      },
      initialValue: "after",
    }),
    defineField({
      name: "textSpacing",
      type: "string",
      title: "Text Spacing",
      description: "Adjust spacing between the animation and title when shown.",
      options: {
        list: [
          { title: "None", value: "none" },
          { title: "Tight", value: "tight" },
          { title: "Compact", value: "compact" },
          { title: "Comfortable", value: "comfortable" },
          { title: "Roomy", value: "roomy" },
        ],
        layout: "radio",
      },
      initialValue: "compact",
    }),
    defineField({
      name: "animation",
      type: "file",
      title: "Lottie Animation",
      description: "Upload a Lottie JSON animation.",
      options: {
        accept: "application/json",
      },
      validation: (rule) => rule.required().error("A Lottie animation is required."),
    }),
    defineField({
      name: "animationDark",
      type: "file",
      title: "Dark Mode Lottie Animation",
      description: "Optional animation used when the site is in dark mode.",
      options: {
        accept: "application/json",
      },
    }),
    defineField({
      name: "ariaLabel",
      type: "string",
      title: "Accessible Label",
      description: "Optional description for assistive technologies.",
    }),
  ],
  preview: {
    select: {
      size: "animationSize",
      align: "animationAlign",
      animation: "animation",
    },
    prepare({ size, align, animation }) {
      const hasAnimation = Boolean(
        animation?.asset?._ref ||
          animation?.asset?._id ||
          animation?._sanityAsset ||
          animation?.url
      );

      return {
        title: "Lottie Animation",
        subtitle: hasAnimation
          ? `Size: ${size || "medium"} · Align: ${align || "center"}`
          : "Missing animation",
      };
    },
  },
});
