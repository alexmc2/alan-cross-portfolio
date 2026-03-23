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

type VimeoEmbedOptions = {
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  hideUi?: boolean;
  dnt?: boolean;
};

export type ExternalMediaSource = {
  mediaType: 'iframe' | 'video';
  src: string;
  mimeType?: string;
  posterSrc?: string | null;
};

const DIRECT_VIDEO_MIME_TYPES: Record<string, string> = {
  mp4: 'video/mp4',
  m4v: 'video/mp4',
  webm: 'video/webm',
  ogg: 'video/ogg',
  ogv: 'video/ogg',
  mov: 'video/quicktime',
};

const hasDomain = (hostname: string, domain: string): boolean => {
  return hostname === domain || hostname.endsWith(`.${domain}`);
};

const isVimeoHostname = (hostname: string): boolean => {
  const lower = hostname.toLowerCase();
  return hasDomain(lower, 'vimeo.com');
};

const isYouTubeHostname = (hostname: string): boolean => {
  const lower = hostname.toLowerCase();
  return (
    lower === 'youtu.be' ||
    hasDomain(lower, 'youtube.com') ||
    hasDomain(lower, 'youtube-nocookie.com')
  );
};

const isCloudinaryHostname = (hostname: string): boolean => {
  return hasDomain(hostname.toLowerCase(), 'res.cloudinary.com');
};

const isCloudinaryVideoUrl = (url: URL): boolean => {
  if (!isCloudinaryHostname(url.hostname)) return false;

  return (
    url.pathname.includes('/video/upload/') ||
    url.pathname.includes('/video/private/') ||
    url.pathname.includes('/video/authenticated/')
  );
};

export function directVideoMimeType(raw: string): string | null {
  try {
    const url = new URL(raw);
    const extension = url.pathname.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase();
    return extension ? DIRECT_VIDEO_MIME_TYPES[extension] ?? null : null;
  } catch {
    return null;
  }
}

export function isDirectVideoUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    if (!/^https?:$/.test(url.protocol)) return false;

    return Boolean(directVideoMimeType(raw) || isCloudinaryVideoUrl(url));
  } catch {
    return false;
  }
}

export function cloudinaryPosterUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    const marker = '/video/upload/';
    if (!isCloudinaryVideoUrl(url) || !url.pathname.includes(marker)) return null;

    const markerIndex = url.pathname.indexOf(marker);
    const prefix = url.pathname.slice(0, markerIndex + marker.length);
    const remainder = url.pathname.slice(markerIndex + marker.length);
    const posterPath = /\.[a-z0-9]+$/i.test(remainder)
      ? remainder.replace(/\.[a-z0-9]+$/i, '.jpg')
      : `${remainder}.jpg`;

    url.pathname = `${prefix}so_1,f_jpg/${posterPath}`;
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Normalise a Vimeo player URL for reliable background-style embedding.
 *
 * `background=1` is a Vimeo Plus/Pro/Business feature — if the video’s
 * account doesn’t support it the iframe renders a blank black screen.
 * We strip it and instead set the free-tier params that hide as much
 * chrome as possible while still allowing autoplay.
 */
export function normaliseVimeoUrl(
  raw: string,
  options: VimeoEmbedOptions = {},
): string {
  try {
    const url = new URL(raw);
    if (!isVimeoHostname(url.hostname)) return raw;

    const {
      autoplay = true,
      loop = true,
      muted = true,
      hideUi = true,
      dnt = true,
    } = options;

    // Remove the premium-only background flag
    url.searchParams.delete('background');

    // Ensure autoplay / loop / muted (works on every plan)
    url.searchParams.set('autoplay', autoplay ? '1' : '0');
    url.searchParams.set('loop', loop ? '1' : '0');
    url.searchParams.set('muted', muted ? '1' : '0');

    if (hideUi) {
      // Hide UI elements (free-tier friendly)
      url.searchParams.set('title', '0');
      url.searchParams.set('byline', '0');
      url.searchParams.set('portrait', '0');
      url.searchParams.set('controls', '0');
    } else {
      url.searchParams.set('title', '1');
      url.searchParams.set('byline', '1');
      url.searchParams.set('portrait', '1');
      url.searchParams.set('controls', '1');
    }

    url.searchParams.set('dnt', dnt ? '1' : '0');

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
export function vimeoEmbedUrl(
  raw: string,
  options: VimeoEmbedOptions = {},
): string | null {
  try {
    const url = new URL(raw);

    // Already a player URL — just normalise params
    if (url.hostname === 'player.vimeo.com') {
      return normaliseVimeoUrl(raw, options);
    }

    // Standard vimeo.com/12345 watch page
    if (isVimeoHostname(url.hostname)) {
      const videoSegment = url.pathname.match(/\/video\/(\d+)/);
      const allNumeric = [...url.pathname.matchAll(/\/(\d+)/g)];
      const id = videoSegment?.[1] ?? allNumeric.at(-1)?.[1];
      if (id) {
        const embedBase = `https://player.vimeo.com/video/${id}`;
        // Carry over the hash param (h=...) if present in the original
        const hParam = url.searchParams.get('h');
        const withH = hParam ? `${embedBase}?h=${hParam}` : embedBase;
        return normaliseVimeoUrl(withH, options);
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Extract a Vimeo video id from watch or player URLs.
 */
export function vimeoVideoId(raw: string): string | null {
  try {
    const url = new URL(raw);
    if (!isVimeoHostname(url.hostname)) return null;

    const playerMatch = url.pathname.match(/\/video\/(\d+)/);
    if (playerMatch) return playerMatch[1];

    // Fall back to last numeric segment to handle showcase/album paths
    const allNumeric = [...url.pathname.matchAll(/\/(\d+)/g)];
    return allNumeric.at(-1)?.[1] ?? null;
  } catch {
    return null;
  }
}

/**
 * Lightweight poster via vumbnail service for Vimeo videos.
 */
export function vimeoPosterUrl(raw: string): string | null {
  const id = vimeoVideoId(raw);
  return id ? `https://vumbnail.com/${id}.jpg` : null;
}

/**
 * Extract a YouTube video id from common watch/share/embed URLs.
 */
export function youtubeVideoId(raw: string): string | null {
  try {
    const url = new URL(raw);
    if (!isYouTubeHostname(url.hostname)) return null;

    if (url.hostname.toLowerCase() === 'youtu.be') {
      const shortId = url.pathname.split('/').filter(Boolean)[0];
      return shortId || null;
    }

    if (url.pathname.startsWith('/watch')) {
      return url.searchParams.get('v') || null;
    }

    const embedMatch = url.pathname.match(/^\/embed\/([^/?#]+)/);
    if (embedMatch) return embedMatch[1];

    const shortsMatch = url.pathname.match(/^\/shorts\/([^/?#]+)/);
    if (shortsMatch) return shortsMatch[1];

    const liveMatch = url.pathname.match(/^\/live\/([^/?#]+)/);
    if (liveMatch) return liveMatch[1];

    return null;
  } catch {
    return null;
  }
}

/**
 * Convert YouTube URL into a muted autoplay embed.
 */
export function youtubeEmbedUrl(raw: string): string | null {
  const id = youtubeVideoId(raw);
  if (!id) return null;

  try {
    const url = new URL(`https://www.youtube-nocookie.com/embed/${id}`);
    url.searchParams.set('autoplay', '1');
    url.searchParams.set('mute', '1');
    url.searchParams.set('loop', '1');
    url.searchParams.set('playlist', id);
    url.searchParams.set('controls', '0');
    url.searchParams.set('rel', '0');
    url.searchParams.set('playsinline', '1');
    url.searchParams.set('modestbranding', '1');
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Lightweight poster for YouTube videos.
 */
export function youtubePosterUrl(raw: string): string | null {
  const id = youtubeVideoId(raw);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

export function resolveExternalMediaSource(
  raw: string,
): ExternalMediaSource | null {
  const vimeoSrc = vimeoEmbedUrl(raw);
  if (vimeoSrc) {
    return {
      mediaType: 'iframe',
      src: vimeoSrc,
      posterSrc: vimeoPosterUrl(raw),
    };
  }

  const youtubeSrc = youtubeEmbedUrl(raw);
  if (youtubeSrc) {
    return {
      mediaType: 'iframe',
      src: youtubeSrc,
      posterSrc: youtubePosterUrl(raw),
    };
  }

  if (isDirectVideoUrl(raw)) {
    return {
      mediaType: 'video',
      src: raw,
      mimeType: directVideoMimeType(raw) ?? undefined,
      posterSrc: cloudinaryPosterUrl(raw),
    };
  }

  return null;
}
