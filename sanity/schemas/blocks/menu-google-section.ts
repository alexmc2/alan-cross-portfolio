// sanity/schemas/blocks/menu-google-section.ts
import { defineArrayMember, defineField, defineType } from "sanity";
import { PanelsTopLeft } from "lucide-react";

const ENTRY_MODE_OPTIONS = [
  { title: "Structured items", value: "structured" },
  { title: "Plain text paste", value: "text" },
];

const ACCORDION_BEHAVIOUR_OPTIONS = [
  { title: "Expand all categories", value: "expanded" },
  { title: "Collapse to first category", value: "first-open" },
];

export default defineType({
  name: "menu-google-section",
  title: "Google Menu Section",
  type: "object",
  icon: PanelsTopLeft,
  groups: [
    { name: "content", title: "Content" },
    { name: "display", title: "Display" },
  ],
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
      group: "display",
      description: "Control vertical spacing above and below the section.",
    }),
    defineField({
      name: "sectionId",
      type: "string",
      title: "Section anchor ID",
      description:
        "Set a unique, lowercase anchor (e.g. menu) so navigation links can scroll to this section.",
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
      title: "Section eyebrow",
      description: "Short label displayed above the heading.",
      group: "content",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Section title",
      description: "Headline displayed at the top of the menu block.",
      group: "content",
    }),
    defineField({
      name: "intro",
      type: "text",
      title: "Intro copy",
      group: "content",
      rows: 3,
      description: "Optional short introduction or ordering note.",
    }),
    defineField({
      name: "accordionBehaviour",
      type: "string",
      title: "Accordion behaviour",
      group: "display",
      description: "Choose how menu categories expand when the page loads.",
      options: {
        list: ACCORDION_BEHAVIOUR_OPTIONS,
        layout: "radio",
      },
      initialValue: "expanded",
    }),
    defineField({
      name: "headingAlignment",
      type: "string",
      title: "Heading alignment",
      description: "Switch to centre align the section heading and intro copy.",
      group: "display",
      options: {
        list: [
          { title: "Left align", value: "left" },
          { title: "Centre align", value: "center" },
        ],
        layout: "radio",
      },
      initialValue: "left",
    }),
    defineField({
      name: "appearance",
      type: "object",
      title: "Appearance",
      group: "display",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "backgroundColor",
          type: "color-variant",
          title: "Background color",
          description: "Sets the section background using the design system palette.",
          initialValue: "background",
        }),
        defineField({
          name: "backgroundColorDark",
          type: "color-variant",
          title: "Background color (dark mode)",
          description: "Optional override applied when viewed in dark mode.",
        }),
        defineField({
          name: "panelColor",
          type: "color-variant",
          title: "Panel color",
          description: "Controls the menu card background.",
          initialValue: "card",
        }),
        defineField({
          name: "panelColorDark",
          type: "color-variant",
          title: "Panel color (dark mode)",
          description: "Optional override for the menu card background in dark mode.",
        }),
        defineField({
          name: "accentColor",
          type: "color-variant",
          title: "Accent color",
          description: "Highlights active tabs, prices, and badges.",
          initialValue: "primary",
        }),
        defineField({
          name: "accentColorDark",
          type: "color-variant",
          title: "Accent color (dark mode)",
          description: "Optional override for highlight colors in dark mode.",
        }),
        defineField({
          name: "headingColor",
          type: "color-variant",
          title: "Heading text color",
          description: "Overrides the section title color.",
        }),
        defineField({
          name: "headingColorDark",
          type: "color-variant",
          title: "Heading text color (dark mode)",
          description: "Optional override for the section title in dark mode.",
        }),
        defineField({
          name: "tabColor",
          type: "color-variant",
          title: "Tab text color",
          description: "Overrides the color of menu navigation tabs.",
        }),
        defineField({
          name: "tabColorDark",
          type: "color-variant",
          title: "Tab text color (dark mode)",
          description: "Optional override applied when the site is viewed in dark mode.",
        }),
        defineField({
          name: "categoryColor",
          type: "color-variant",
          title: "Category heading color",
          description: "Sets the color used for each accordion category title.",
        }),
        defineField({
          name: "categoryColorDark",
          type: "color-variant",
          title: "Category heading color (dark mode)",
          description: "Optional override for category titles in dark mode.",
        }),
        defineField({
          name: "borderColor",
          type: "color-variant",
          title: "Border color",
          description: "Sets the border color used across the menu shell and controls.",
        }),
        defineField({
          name: "borderColorDark",
          type: "color-variant",
          title: "Border color (dark mode)",
          description: "Optional override for borders when the site is viewed in dark mode.",
        }),
      ],
    }),
    defineField({
      name: "categories",
      type: "array",
      group: "content",
      title: "Menu categories",
      description: "Organise menu items by category, mimicking Google’s menu layout.",
      of: [
        defineArrayMember({
          type: "object",
          name: "menuGoogleCategory",
          title: "Menu category",
          fields: [
            defineField({
              name: "title",
              type: "string",
              validation: (rule) =>
                rule.required().error("Every category needs a title."),
            }),
            defineField({
              name: "tagline",
              type: "string",
              title: "Category tagline",
              description: "Optional one-line description shown under the title.",
            }),
            defineField({
              name: "itemEntryMode",
              type: "string",
              title: "Item entry mode",
              description:
                "Switch to plain text paste mode for quick copy-paste directly from Google.",
              options: {
                list: ENTRY_MODE_OPTIONS,
                layout: "radio",
              },
              initialValue: "structured",
            }),
            defineField({
              name: "items",
              type: "array",
              title: "Menu items",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "menuGoogleItem",
                  title: "Menu item",
                  fields: [
                    defineField({
                      name: "name",
                      type: "string",
                      validation: (rule) =>
                        rule.required().error("Menu items must include a name."),
                    }),
                    defineField({
                      name: "price",
                      type: "string",
                      description: "Accepts any currency or price format.",
                      validation: (rule) =>
                        rule.max(20).warning("Keep prices brief for best alignment."),
                    }),
                    defineField({
                      name: "description",
                      type: "text",
                      rows: 3,
                      description: "Optional supporting copy copied from Google.",
                    }),
                    defineField({
                      name: "dietary",
                      type: "array",
                      title: "Dietary tags",
                      description: "Add dietary or availability notes (e.g. VE, GF).",
                      of: [
                        defineArrayMember({
                          type: "string",
                          name: "dietaryTag",
                          title: "Dietary tag",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
              hidden: ({ parent }) => {
                const mode = (parent as { itemEntryMode?: string } | undefined)?.itemEntryMode;
                return mode !== "structured";
              },
              validation: (rule) =>
                rule.custom((items, context) => {
                  const mode = (context.parent as { itemEntryMode?: string } | undefined)?.itemEntryMode;
                  if (mode === "structured") {
                    return items && items.length > 0
                      ? true
                      : "Add at least one menu item or switch to plain text mode.";
                  }
                  return true;
                }),
            }),
            defineField({
              name: "rawItems",
              type: "text",
              rows: 12,
              title: "Plain text items",
              description:
                "Paste `Name | Price | Optional description`, or three Google lines (name, description, price) per item.",
              hidden: ({ parent }) => {
                const mode = (parent as { itemEntryMode?: string } | undefined)?.itemEntryMode;
                return mode !== "text";
              },
              validation: (rule) =>
                rule.custom((value, context) => {
                  const mode = (context.parent as { itemEntryMode?: string } | undefined)?.itemEntryMode;
                  if (mode === "text") {
                    return value?.trim()
                      ? true
                      : "Paste at least one line of menu text or switch modes.";
                  }
                  return true;
                }),
            }),
          ],
          preview: {
            select: {
              title: "title",
              items: "items",
              rawItems: "rawItems",
            },
            prepare({ title, items, rawItems }) {
              const itemCount = items?.length ?? rawItems?.split("\n").filter(Boolean).length ?? 0;
              return {
                title: title || "Untitled category",
                subtitle: itemCount ? `${itemCount} item${itemCount === 1 ? "" : "s"}` : "No items yet",
              };
            },
          },
        }),
      ],
      validation: (rule) =>
        rule.min(1).error("Add at least one menu category to publish."),
    }),
  ],
  preview: {
    select: {
      title: "title",
      eyebrow: "eyebrow",
      category: "categories.0.title",
    },
    prepare({ title, eyebrow, category }) {
      return {
        title: title || "Google Menu Section",
        subtitle: [eyebrow, category].filter(Boolean).join(" • ") || "Interactive menu block",
      };
    },
  },
});
