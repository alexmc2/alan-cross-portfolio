// sanity/schemas/blocks/split/split-contact-form.ts
import { defineField, defineType } from "sanity";
import { Mail } from "lucide-react";

export default defineType({
  name: "split-contact-form",
  type: "object",
  title: "Split Contact Form",
  icon: Mail,
  description:
    "Compact contact form column for split layouts. Configure the form content without section padding.",
  fields: [
    defineField({
      name: "heading",
      type: "string",
      title: "Heading",
      description: "Optional title displayed above the contact form.",
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
      description:
        "Use the ID from your Formspree dashboard (e.g. xwkyzagk).",
      validation: (rule) =>
        rule
          .required()
          .error("Provide the Formspree form ID to enable submissions."),
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
      description: "Shown to the visitor when the form is successfully submitted.",
      initialValue: "Thanks for reaching out! We'll get back to you shortly.",
    }),
  ],
  preview: {
    select: {
      title: "heading",
    },
    prepare({ title }) {
      return {
        title: title || "Contact form",
        subtitle: "Split column",
      };
    },
  },
});
