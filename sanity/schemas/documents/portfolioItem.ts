import { defineField, defineType } from 'sanity';
import { Film } from 'lucide-react';

export default defineType({
  name: 'portfolioItem',
  title: 'Portfolio Item',
  type: 'document',
  icon: Film,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'AI Video', value: 'AI Video' },
          { title: 'Short Film', value: 'Short Film' },
          { title: 'Narrative', value: 'Narrative' },
          { title: 'Motion Graphics', value: 'Motion Graphics' },
          { title: 'Community Film', value: 'Community Film' },
          { title: 'Aerial', value: 'Aerial' },
          { title: 'Animation', value: 'Animation' },
          { title: 'Sound', value: 'Sound' },
          { title: 'Other', value: 'Other' },
        ],
      },
    }),
    defineField({
      name: 'vimeoUrl',
      title: 'Vimeo URL (Legacy)',
      description: 'Existing Vimeo-only field kept for backward compatibility',
      type: 'url',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      description:
        'Paste a video URL from Vimeo, YouTube, Cloudinary, or a direct MP4/WebM file. Uploads still work too.',
      type: 'url',
    }),
    defineField({
      name: 'videoFile',
      title: 'Video File Upload',
      description: 'Optional uploaded video file (MP4/WebM)',
      type: 'file',
      options: {
        accept: 'video/mp4,video/webm',
      },
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      description: 'Poster image shown before the video loads',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'Short description shown on hover',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      description: 'Mark as a featured portfolio piece',
      type: 'boolean',
      initialValue: false,
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
      title: 'title',
      subtitle: 'category',
      media: 'thumbnail',
    },
  },
});
