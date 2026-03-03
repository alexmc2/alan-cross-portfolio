// sanity/schemas/blocks/forms/contact.ts
import { defineField, defineType } from 'sanity';
import { Mail } from 'lucide-react';

export default defineType({
  name: 'form-contact',
  title: 'Form: Contact',
  type: 'object',
  description: 'Capture enquiries with a simple contact form block.',
  icon: Mail,
  fields: [
    defineField({
      name: 'padding',
      type: 'section-padding',
    }),
    defineField({
      name: 'colorVariant',
      type: 'color-variant',
      title: 'Color Variant',
      description: 'Select a background color variant for the section',
    }),
    defineField({
      name: 'heading',
      type: 'string',
      description: 'Add a headline so visitors know how to get in touch.',
    }),
    defineField({
      name: 'body',
      title: 'Body Copy',
      type: 'text',
      rows: 3,
      description: 'Short supporting copy rendered above the form.',
    }),
    defineField({
      name: 'formspreeFormId',
      title: 'Formspree Form ID',
      type: 'string',
      description: 'Use the ID from your Formspree dashboard (e.g. xwkyzagk).',
      validation: (Rule) =>
        Rule.required().error(
          'Provide the Formspree form ID to enable submissions.'
        ),
    }),
    defineField({
      name: 'submitButtonLabel',
      title: 'Submit Button Label',
      type: 'string',
      initialValue: 'Send message',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success Message',
      type: 'string',
      initialValue: "Thanks for reaching out! We'll get back to you shortly.",
    }),
  ],
  preview: {
    select: {
      title: 'heading',
    },
    prepare({ title }) {
      return {
        title: title || 'Contact form',
        subtitle: 'Form',
      };
    },
  },
});
