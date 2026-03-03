// sanity/schemas/blocks/location/location-map.ts
import { defineField, defineType } from "sanity";
import { MapPin } from "lucide-react";

export default defineType({
  name: "location-map",
  title: "Location Map",
  type: "object",
  description: "Display a Google Map and address details for your venue.",
  icon: MapPin,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "colorVariant",
      type: "color-variant",
      title: "Color Variant",
      description: "Select a background color variant for the section",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: "Optional title displayed above the map (e.g. Our location).",
    }),
    defineField({
      name: "headingAlignment",
      title: "Heading Alignment",
      type: "string",
      description: "Align the heading within the section.",
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
      description: "Optional label displayed above the location details (e.g. Our location).",
      initialValue: "Our location",
    }),
    defineField({
      name: "locationName",
      title: "Location Name",
      type: "string",
      validation: (Rule) =>
        Rule.required().error("Add the location name so the map has a caption."),
    }),
    defineField({
      name: "address",
      title: "Street Address",
      type: "text",
      rows: 2,
      description: "Displayed beneath the map to help visitors plan their visit.",
      validation: (Rule) =>
        Rule.required().error("Include the address shown below the map."),
    }),
    defineField({
      name: "latitude",
      title: "Latitude",
      type: "number",
      description: "Decimal latitude used for the map marker (e.g. 52.1999).",
      validation: (Rule) =>
        Rule.required()
          .min(-90)
          .max(90)
          .error("Latitude must be between -90 and 90."),
    }),
    defineField({
      name: "longitude",
      title: "Longitude",
      type: "number",
      description: "Decimal longitude used for the map marker (e.g. 0.1266).",
      validation: (Rule) =>
        Rule.required()
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
      validation: (Rule) =>
        Rule.min(1)
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
        subtitle: subtitle || heading || title || "No label",
      };
    },
  },
});
