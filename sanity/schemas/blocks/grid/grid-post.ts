// sanity/schemas/blocks/grid/grid-post.ts
import { defineField, defineType } from 'sanity';
import { LayoutGrid } from 'lucide-react';

export default defineType({
  name: 'grid-post',
  type: 'object',
  icon: LayoutGrid,
  fields: [
    defineField({
      name: 'post',
      type: 'reference',
      title: 'news Post',
      description: 'Select a news post to link to.',
      to: [{ type: 'post' }],
    }),
  ],
  preview: {
    select: {
      title: 'post.title',
      media: 'image',
    },
    prepare({ title, media }) {
      return {
        title: 'Grid Card',
        subtitle: title || 'No title',
        media,
      };
    },
  },
});
