// sanity/schemas/blocks/forms/contact-map.ts
import { defineField, defineType } from "sanity";
import { MapPin } from "lucide-react";

export default defineType({
  name: "form-contact-map",
  title: "Form: Contact + Map",
  type: "object",
  description:
    "Display a contact capture form alongside a Google Map for your physical location.",
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
      type: "string",
      validation: (Rule) =>
        Rule.required().error("Add a headline so visitors know how to get in touch."),
    }),
    defineField({
      name: "body",
      title: "Body Copy",
      type: "text",
      rows: 3,
      description: "Short supporting copy rendered above the form.",
    }),
    defineField({
      name: "formspreeFormId",
      title: "Formspree Form ID",
      type: "string",
      description: "Use the ID from your Formspree dashboard (e.g. xwkyzagk).",
      validation: (Rule) =>
        Rule.required().error("Provide the Formspree form ID to enable submissions."),
    }),
    defineField({
      name: "submitButtonLabel",
      title: "Submit Button Label",
      type: "string",
      initialValue: "Send message",
    }),
    defineField({
      name: "successMessage",
      title: "Success Message",
      type: "string",
      initialValue: "Thanks for reaching out! We'll get back to you shortly.",
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
      description: "Decimal latitude used for the map marker (e.g. 37.7749).",
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
      description: "Decimal longitude used for the map marker (e.g. -122.4194).",
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
      title: "heading",
      subtitle: "locationName",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Contact + Map",
        subtitle: subtitle || "No location selected",
      };
    },
  },
});
