// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string): string => {
  const dateObj = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return dateObj.toLocaleDateString('en-US', options);
};

// Define the types for block content and children
type Block = {
  _type: string;
  children?: Array<{ text: string }>;
};

type BlockContent = Block[] | null;

// Helper function to extract plain text from block content
export const extractPlainText = (blocks: BlockContent): string | null => {
  if (!blocks || !Array.isArray(blocks)) return null;

  return blocks
    .map((block) => {
      if (block._type === 'block' && Array.isArray(block.children)) {
        return block.children.map((child) => child.text).join('');
      }
      return '';
    })
    .join(' ');
};

/**
 * Normalise a Vimeo player URL for reliable background-style embedding.
 *
 * `background=1` is a Vimeo Plus/Pro/Business feature — if the video’s
 * account doesn’t support it the iframe renders a blank black screen.
 * We strip it and instead set the free-tier params that hide as much
 * chrome as possible while still allowing autoplay.
 */
export function normaliseVimeoUrl(raw: string): string {
  try {
    const url = new URL(raw);
    if (!url.hostname.includes('vimeo.com')) return raw;

    // Remove the premium-only background flag
    url.searchParams.delete('background');

    // Ensure autoplay / loop / muted (works on every plan)
    url.searchParams.set('autoplay', '1');
    url.searchParams.set('loop', '1');
    url.searchParams.set('muted', '1');

    // Hide UI elements (free-tier friendly)
    url.searchParams.set('title', '0');
    url.searchParams.set('byline', '0');
    url.searchParams.set('portrait', '0');
    url.searchParams.set('controls', '0');
    url.searchParams.set('dnt', '1');

    return url.toString();
  } catch {
    return raw;
  }
}

/**
 * Convert any Vimeo URL (watch page or player URL) into an embeddable
 * player.vimeo.com URL with background-style params.
 *
 * Accepts:
 *   https://vimeo.com/7851544
 *   https://player.vimeo.com/video/7851544?h=abc123&...
 */
export function vimeoEmbedUrl(raw: string): string | null {
  try {
    const url = new URL(raw);

    // Already a player URL — just normalise params
    if (url.hostname === 'player.vimeo.com') {
      return normaliseVimeoUrl(raw);
    }

    // Standard vimeo.com/12345 watch page
    if (url.hostname.includes('vimeo.com')) {
      const match = url.pathname.match(/\/(\d+)/);
      if (match) {
        const embedBase = `https://player.vimeo.com/video/${match[1]}`;
        // Carry over the hash param (h=...) if present in the original
        const hParam = url.searchParams.get('h');
        const withH = hParam ? `${embedBase}?h=${hParam}` : embedBase;
        return normaliseVimeoUrl(withH);
      }
    }

    return null;
  } catch {
    return null;
  }
}
