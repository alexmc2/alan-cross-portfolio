// sanity/schemas/blocks/menu-section.ts
import { defineArrayMember, defineField, defineType } from "sanity";
import { UtensilsCrossed } from "lucide-react";

const TEXTURE_OPTIONS = [
  { title: "Soft Paper", value: "paper" },
  { title: "Canvas Weave", value: "canvas" },
  { title: "Linen Crosshatch", value: "linen" },
];

const DISPLAY_MODE_OPTIONS = [
  { title: "Structured Items", value: "structured" },
  { title: "Menu Image", value: "image" },
  { title: "Image With Items", value: "combined" },
];

const HEADING_FONT_OPTIONS = [
  { title: "Modern Sans", value: "sans" },
  { title: "Elegant Serif", value: "serif" },
];

export default defineType({
  name: "menu-section",
  title: "Menu Section",
  type: "object",
  icon: UtensilsCrossed,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
      description: "Control vertical spacing above and below the section.",
    }),
    defineField({
      name: "background",
      title: "Background",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "style",
          type: "string",
          title: "Style",
          description: "Select the type of background for this section.",
          options: {
            list: [
              { title: "Solid Color", value: "color" },
              { title: "Texture", value: "texture" },
              { title: "Custom Image", value: "image" },
            ],
            layout: "radio",
          },
          initialValue: "color",
        }),
        defineField({
          name: "colorVariant",
          type: "color-variant",
          title: "Color Variant",
          description: "Applies a background from the design system palette.",
          hidden: ({ parent }) => parent?.style !== "color",
        }),
        defineField({
          name: "texturePreset",
          type: "string",
          title: "Texture Preset",
          description: "Choose a built-in paper or canvas-inspired texture.",
          options: {
            list: TEXTURE_OPTIONS,
            layout: "radio",
          },
          hidden: ({ parent }) => parent?.style !== "texture",
        }),
        defineField({
          name: "textureTint",
          type: "color-variant",
          title: "Texture Tint",
          description: "Optional tint color layered under the texture.",
          hidden: ({ parent }) => parent?.style !== "texture",
        }),
        defineField({
          name: "customImage",
          type: "image",
          title: "Custom Background Image",
          description: "Upload a subtle background photo or scan to display behind the menu.",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alternative Text",
              description: "Describe the background for accessibility.",
            }),
            defineField({
              name: "opacity",
              type: "number",
              title: "Overlay Opacity",
              description: "Adjust the intensity of the image overlay (0.1 – 0.8).",
              validation: (rule) =>
                rule
                  .min(0.1)
                  .max(0.8)
                  .precision(2)
                  .warning("Keep the overlay subtle to preserve readability."),
            }),
          ],
          hidden: ({ parent }) => parent?.style !== "image",
        }),
      ],
    }),
    defineField({
      name: "eyebrow",
      type: "string",
      title: "Section Eyebrow",
      description: "Short label displayed above the main heading.",
    }),
    defineField({
      name: "title",
      type: "string",
      description: "Primary section heading displayed to guests.",
    }),
    defineField({
      name: "sectionId",
      type: "string",
      title: "Section Anchor ID",
      description:
        "Set a unique, lowercase anchor (e.g. menus) so navigation links can scroll to this section.",
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
      name: "intro",
      type: "text",
      title: "Intro Copy",
      description: "Optional short introduction or chef’s note.",
      rows: 3,
    }),
    defineField({
      name: "headingFont",
      type: "string",
      title: "Heading Typeface",
      description: "Switch between sans or serif styling for the heading.",
      options: {
        list: HEADING_FONT_OPTIONS,
        layout: "radio",
      },
      initialValue: "sans",
    }),
    defineField({
      name: "displayMode",
      type: "string",
      title: "Menu Content Mode",
      description: "Choose whether to show structured items, an image, or both.",
      options: {
        list: DISPLAY_MODE_OPTIONS,
        layout: "radio",
      },
      initialValue: "structured",
    }),
    defineField({
      name: "menuImages",
      type: "array",
      title: "Menu Images",
      description: "Upload menu scans or detail shots (multiple images allowed).",
      of: [
        defineArrayMember({
          type: "image",
          name: "menuImage",
          title: "Menu Image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alternative Text",
              description: "Describe the image for guests using assistive tech.",
            }),
            defineField({
              name: "focus",
              type: "string",
              title: "Focus Label",
              description: "Optional label to help editors differentiate images.",
            }),
          ],
        }),
      ],
      options: {
        layout: "grid",
      },
      validation: (rule) => rule.max(6),
      hidden: ({ parent }) => parent?.displayMode === "structured",
    }),
    defineField({
      name: "imagePlacement",
      type: "string",
      title: "Image Placement",
      description: "Choose where menu images should appear on desktop layouts.",
      options: {
        list: [
          { title: "Right Column", value: "right" },
          { title: "Left Column", value: "left" },
          { title: "Both Sides", value: "split" },
        ],
        layout: "radio",
      },
      initialValue: "right",
      hidden: ({ parent }) => parent?.displayMode === "structured",
    }),
    defineField({
      name: "imageLayout",
      type: "string",
      title: "Image Layout",
      description: "Display images stacked or side-by-side when space allows.",
      options: {
        list: [
          { title: "Stacked", value: "stacked" },
          { title: "Inline Row", value: "inline" },
        ],
        layout: "radio",
      },
      initialValue: "stacked",
      hidden: ({ parent }) => parent?.displayMode === "structured",
    }),
    defineField({
      name: "categories",
      type: "array",
      title: "Menu Categories",
      description: "Curate menu categories and items shown to guests.",
      of: [
        defineArrayMember({
          type: "object",
          name: "menuCategory",
          title: "Menu Category",
          fields: [
            defineField({
              name: "title",
              type: "string",
              description: "Category name (e.g., Starters, Entrées).",
              validation: (rule) =>
                rule.required().error("Each category needs a descriptive title."),
            }),
            defineField({
              name: "description",
              type: "text",
              title: "Category Description",
              description: "Optional short description or pairing notes.",
              rows: 2,
            }),
            defineField({
              name: "items",
              type: "array",
              title: "Menu Items",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "menuItem",
                  title: "Menu Item",
                  fields: [
                    defineField({
                      name: "name",
                      type: "string",
                      description: "Dish or beverage name.",
                      validation: (rule) =>
                        rule
                          .required()
                          .error("Every menu item needs a name."),
                    }),
                    defineField({
                      name: "description",
                      type: "text",
                      title: "Description",
                      description: "Short tasting notes or key ingredients (optional).",
                      rows: 3,
                    }),
                    defineField({
                      name: "price",
                      type: "string",
                      description: "Formatted price (e.g., $18, Market).",
                      validation: (rule) =>
                        rule
                          .required()
                          .error("Include a price or pricing note for each item."),
                    }),
                    defineField({
                      name: "itemImage",
                      type: "image",
                      title: "Item Image",
                      description: "Optional plated photo or illustration.",
                      options: { hotspot: true },
                      fields: [
                        defineField({
                          name: "alt",
                          type: "string",
                          title: "Alternative Text",
                          description: "Describe the dish image for accessibility.",
                        }),
                      ],
                    }),
                    defineField({
                      name: "dietary",
                      type: "string",
                      title: "Dietary Tag",
                      description: "Optional dietary tag (e.g., Vegan, GF).",
                    }),
                  ],
                  preview: {
                    select: {
                      title: "name",
                      subtitle: "price",
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "title",
              count: "items.length",
            },
            prepare({ title, count }) {
              return {
                title: title || "Untitled Category",
                subtitle: count ? `${count} item${count === 1 ? "" : "s"}` : "No items",
              };
            },
          },
        }),
      ],
      hidden: ({ parent }) => parent?.displayMode === "image",
    }),
    defineField({
      name: "lottieAnimation",
      type: "file",
      title: "Optional Lottie Animation",
      description: "Upload a Lottie JSON animation to accent the menu.",
      options: {
        accept: "application/json",
      },
    }),
    defineField({
      name: "lottiePlacement",
      type: "string",
      title: "Animation Placement",
      description: "Choose where the Lottie animation appears if provided.",
      options: {
        list: [
          { title: "Heading Accent", value: "heading" },
          { title: "Aside", value: "aside" },
        ],
        layout: "radio",
      },
      hidden: ({ parent }) => !parent?.lottieAnimation,
      initialValue: "heading",
    }),
  ],
  preview: {
    select: {
      title: "title",
      mode: "displayMode",
    },
    prepare({ title, mode }) {
      return {
        title: title || "Menu Section",
        subtitle: mode ? `Mode: ${mode}` : "Structured menu",
      };
    },
  },
});
