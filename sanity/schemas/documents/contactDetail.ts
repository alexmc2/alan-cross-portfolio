import { defineField, defineType } from 'sanity';
import { Contact } from 'lucide-react';

export default defineType({
  name: 'contactDetail',
  title: 'Contact Detail',
  type: 'document',
  icon: Contact,
  fields: [
    defineField({
      name: 'detailType',
      title: 'Type',
      type: 'string',
      description: 'Determines icon and auto-link behaviour',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Social Link', value: 'social' },
          { title: 'Phone', value: 'phone' },
          { title: 'Email', value: 'email' },
          { title: 'Location', value: 'location' },
          { title: 'Address', value: 'address' },
          { title: 'Website', value: 'website' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description:
        'Row label displayed in the contact section, e.g. "LinkedIn", "Mobile", "Location"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      description:
        'The text shown to visitors, e.g. "+44 7700 900000", "South Coast, UK", "linkedin.com/in/alanx"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'linkUrl',
      title: 'Link URL',
      type: 'string',
      description:
        'Optional link. For social/website use the full URL. For phone/email this is auto-generated from the value if left blank (tel: / mailto:).',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      description: 'Manual sort order (lower numbers appear first)',
      type: 'number',
    }),
  ],
  orderings: [
    {
      title: 'Manual Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'value',
      detailType: 'detailType',
    },
    prepare({ title, subtitle, detailType }) {
      const typeLabels: Record<string, string> = {
        social: '🔗',
        phone: '📞',
        email: '✉️',
        location: '📍',
        address: '🏠',
        website: '🌐',
        other: '•',
      };
      return {
        title: `${typeLabels[detailType] || '•'} ${title}`,
        subtitle,
      };
    },
  },
});
