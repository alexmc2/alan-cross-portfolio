// sanity/schemas/blocks/split/split-location-map.ts
import { defineField, defineType } from "sanity";
import { MapPin } from "lucide-react";

export default defineType({
  name: "split-location-map",
  type: "object",
  title: "Split Location Map",
  icon: MapPin,
  description:
    "Display a compact location card with an embedded map inside split layouts.",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: "Optional title displayed above the location card.",
    }),
    defineField({
      name: "headingAlignment",
      title: "Heading Alignment",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "left",
    }),
    defineField({
      name: "locationLabel",
      title: "Label",
      type: "string",
      description: "Small label displayed above the address details.",
      initialValue: "Our location",
    }),
    defineField({
      name: "locationName",
      title: "Location Name",
      type: "string",
      validation: (rule) =>
        rule.required().error("Add the location name displayed above the address."),
    }),
    defineField({
      name: "address",
      title: "Street Address",
      type: "text",
      rows: 2,
      description: "Shown beneath the map to help visitors plan their visit.",
      validation: (rule) =>
        rule.required().error("Include the address shown below the map."),
    }),
    defineField({
      name: "latitude",
      title: "Latitude",
      type: "number",
      validation: (rule) =>
        rule
          .required()
          .min(-90)
          .max(90)
          .error("Latitude must be between -90 and 90."),
    }),
    defineField({
      name: "longitude",
      title: "Longitude",
      type: "number",
      validation: (rule) =>
        rule
          .required()
          .min(-180)
          .max(180)
          .error("Longitude must be between -180 and 180."),
    }),
    defineField({
      name: "mapZoom",
      title: "Map Zoom",
      type: "number",
      description: "Google Maps zoom level. Typical values range from 10 (city) to 18 (street).",
      initialValue: 14,
      validation: (rule) =>
        rule
          .min(1)
          .max(20)
          .warning("Google Maps zoom levels usually fall between 1 and 20."),
    }),
  ],
  preview: {
    select: {
      heading: "heading",
      title: "locationName",
      subtitle: "locationLabel",
    },
    prepare({ heading, title, subtitle }) {
      return {
        title: heading || title || "Location map",
        subtitle: subtitle || heading || title || "Split column",
      };
    },
  },
});
