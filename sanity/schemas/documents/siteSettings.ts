import { defineField, defineType } from 'sanity';
import { Settings } from 'lucide-react';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: Settings,
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'about', title: 'About' },
    { name: 'contact', title: 'Contact' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      description: 'Used for SEO meta description',
      type: 'text',
      rows: 3,
    }),

    // Hero
    defineField({
      name: 'heroTagline',
      title: 'Hero Tagline',
      description:
        'Small text above the title, e.g. "AI Film and Video Production"',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      description: 'Main hero heading',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      description: 'Paragraph below the hero title',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),
    defineField({
      name: 'heroVideo',
      title: 'Hero Video (Upload)',
      description: 'Upload a showreel video file (MP4 or WebM)',
      type: 'file',
      group: 'hero',
      options: {
        accept: 'video/mp4,video/webm',
      },
    }),
    defineField({
      name: 'heroVideoUrl',
      title: 'Hero Video URL (Fallback)',
      description: 'External video URL if not uploading directly',
      type: 'url',
      group: 'hero',
    }),
    defineField({
      name: 'heroHeight',
      title: 'Hero Height',
      description: 'How tall the hero section should be',
      type: 'string',
      group: 'hero',
      options: {
        list: [
          { title: 'Full screen (100%)', value: '100vh' },
          { title: 'Three quarters (75%) — default', value: '75vh' },
          { title: 'Two thirds (66%)', value: '66vh' },
          { title: 'Half (50%)', value: '50vh' },
        ],
        layout: 'radio',
      },
      initialValue: '75vh',
    }),
    defineField({
      name: 'heroEdgeStyle',
      title: 'Hero Edge Style',
      description:
        'How the bottom edge of the hero transitions into the content below',
      type: 'string',
      group: 'hero',
      options: {
        list: [
          { title: 'Gradient fade — default', value: 'gradient' },
          { title: 'Soft blur', value: 'blur' },
          { title: 'Hard edge', value: 'solid' },
        ],
        layout: 'radio',
      },
      initialValue: 'gradient',
    }),

    // About
    defineField({
      name: 'aboutHeading',
      title: 'About Heading',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'aboutBody',
      title: 'About Body',
      description: 'Rich text bio content',
      type: 'block-content',
      group: 'about',
    }),
    defineField({
      name: 'aboutImage',
      title: 'About Image',
      type: 'image',
      group: 'about',
      options: { hotspot: true },
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      description:
        'Statistics displayed below the about text (e.g. "15+" / "Years Experience")',
      type: 'array',
      group: 'about',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'number',
              title: 'Number/Value',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'number', subtitle: 'label' },
          },
        },
      ],
    }),

    // Contact
    defineField({
      name: 'contactHeading',
      title: 'Contact Heading',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'contactSubheading',
      title: 'Contact Subheading',
      type: 'text',
      rows: 3,
      group: 'contact',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      group: 'contact',
    }),

    // SEO
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image (1200x630)',
      type: 'image',
      group: 'seo',
    }),
  ],
  preview: {
    select: { title: 'siteTitle' },
    prepare({ title }) {
      return { title: title || 'Site Settings' };
    },
  },
});
