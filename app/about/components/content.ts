// app/about/components/content.ts
import type { LucideIcon } from 'lucide-react';
import { Images, Megaphone, Sparkles } from 'lucide-react';

import type { DemoCarouselImage } from './demo-carousel';

type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type ProcessStep = {
  title: string;
  copy: string;
};

type HeroContent = {
  title: string;
  description: string;
  benefits: string[];
  carouselImages: DemoCarouselImage[];
  contactEmail: string;
  walkthroughHref: string;
};

type PricingContent = {
  badgeLabel: string;
  priceLabel: string;
  description: string;
  highlight: string;
  contactEmail: string;
  walkthroughHref: string;
  footnote: string;
};

export const HERO_CONTENT: HeroContent = {
  title: 'Professional website for a personal portfolio',
  description:
    'Fast, mobile-friendly, and easy to update yourself. Built for independent businesses who want a professional web presence without the typical costs.',
  benefits: [
    'Have a professional website that makes your business look established',
    'Add new photos from any device',
    'Update key details instantly',
  ],
  carouselImages: [
    {
      src: '/images/carousel/image.png',
      alt: 'Content editor showing updates ready to publish',
    },
    {
      src: '/images/carousel/image2.png',
      alt: 'Gallery management interface with drag and drop sorting',
    },
    {
      src: '/images/carousel/image3.png',
      alt: 'Testimonial block with five star rating',
    },
  ],
  contactEmail: 'hello@alancrossportfolio.com',
  walkthroughHref: '/about/walkthrough',
};

export const FEATURES: Feature[] = [
  {
    title: 'Content management',
    description:
      'Update sections, links, and descriptions whenever you need to. Changes go live immediately.',
    icon: Sparkles,
  },
  {
    title: 'Photo galleries',
    description:
      'Upload new images, update your story, and showcase your space. All manageable from your phone or laptop.',
    icon: Images,
  },
  {
    title: 'News and events',
    description:
      'Announce updates, projects, or milestones. Keep your audience informed without any technical knowledge.',
    icon: Megaphone,
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    title: 'Initial consultation',
    copy: "We discuss your portfolio, what you want to showcase, and I'll tailor the site to match your brand.",
  },
  {
    title: 'Site development',
    copy: "You'll receive a fully functional website with your content. I'll walk you through the editing system and provide login details.",
  },
  {
    title: 'Full control',
    copy: 'Update content yourself whenever needed, or send me changes to implement. Ongoing support available.',
  },
];

export const PRICING_CONTENT: PricingContent = {
  badgeLabel: 'Pricing',
  priceLabel: '£150 flat rate',
  description:
    "Professional website setup including training on the content management system. I'm building my portfolio, which allows me to offer this at an affordable price point.",
  highlight: 'One-off payment · Training included · Local developer',
  contactEmail: 'hello@alancrossportfolio.com',
  walkthroughHref: '/about/walkthrough',
  footnote:
    'Browse the site to see what\'s included. This demo uses placeholder content - yours would feature your actual work, photos, and details.',
};
