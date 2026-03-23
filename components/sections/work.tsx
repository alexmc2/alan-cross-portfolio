import type { PortfolioItem } from '@/types';
import { urlFor } from '@/sanity/lib/image';
import {
  resolveExternalMediaSource,
} from '@/lib/utils';
import Image from 'next/image';
import DeferredMediaFrame from './deferred-media-frame';

export default function Work({ items }: { items: PortfolioItem[] }) {
  return (
    <section id="work" className="py-28 px-12 max-md:py-20 max-md:px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="slabel">Selected Work</div>
        <div className="grid grid-cols-2 gap-6 mt-12 max-[900px]:grid-cols-1">
          {items.map((item) => {
            const videoUrl = item.videoUrl || item.vimeoUrl || null;
            const uploadedVideoUrl = item.videoFile?.asset?.url || null;
            const uploadedVideoMimeType = item.videoFile?.asset?.mimeType;
            const externalMedia = videoUrl
              ? resolveExternalMediaSource(videoUrl)
              : null;
            const mediaSrc = uploadedVideoUrl || externalMedia?.src || null;
            const mediaType = uploadedVideoUrl
              ? 'video'
              : externalMedia?.mediaType;
            const mediaMimeType = uploadedVideoUrl
              ? uploadedVideoMimeType
              : externalMedia?.mimeType;
            const thumbnailUrl = item.thumbnail?.asset
              ? urlFor(item.thumbnail)
                  .width(1200)
                  .height(item.featured ? 514 : 675)
                  .url()
              : null;
            const posterSrc = thumbnailUrl ?? externalMedia?.posterSrc ?? null;
            const destinationHref = uploadedVideoUrl || videoUrl || '#';
            const imageSizes = item.featured ? '1200px' : '600px';

            return (
              <div
                key={item._id}
                className={`relative overflow-hidden group ${
                  item.featured
                    ? 'col-span-2 aspect-[21/9] max-[900px]:col-span-1 max-[900px]:aspect-video'
                    : 'aspect-video'
                }`}
                style={{ background: 'var(--color-bg-card)' }}
              >
                {/* Video / Thumbnail / Placeholder */}
                <div className="w-full h-full">
                  {mediaSrc ? (
                    <DeferredMediaFrame
                      mediaType={mediaType}
                      src={mediaSrc}
                      mimeType={mediaMimeType}
                      title={item.title}
                      fallbackLabel={item.category || 'Video'}
                      sizes={imageSizes}
                      posterSrc={posterSrc ?? undefined}
                      posterBlurDataURL={item.thumbnail?.asset?.metadata?.lqip}
                    />
                  ) : thumbnailUrl ? (
                    <Image
                      src={thumbnailUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes={imageSizes}
                      placeholder={
                        item.thumbnail?.asset?.metadata?.lqip
                          ? 'blur'
                          : undefined
                      }
                      blurDataURL={item.thumbnail?.asset?.metadata?.lqip}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background:
                          'linear-gradient(135deg, #151318, #1a1816 50%, #12110f)',
                      }}
                    >
                      <span className="text-[0.65rem] tracking-[0.25em] uppercase text-text-muted border border-[rgba(255,255,255,0.05)] px-5 py-2.5">
                        {item.category || 'Video'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Hover overlay */}
                <a
                  href={destinationHref}
                  target={destinationHref !== '#' ? '_blank' : undefined}
                  rel={destinationHref !== '#' ? 'noopener noreferrer' : undefined}
                  className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-4 opacity-100 md:inset-0 md:p-8 md:opacity-0 transition-opacity duration-400 md:group-hover:opacity-100 z-10 pointer-events-auto md:pointer-events-none md:group-hover:pointer-events-auto"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 35%, transparent 100%)',
                  }}
                >
                  <h3 className="font-display text-base md:text-2xl font-semibold mb-1 md:mb-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-base text-white/80 tracking-[0.03em] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] line-clamp-2">
                    {item.description
                      ? item.description
                      : `${item.category || ''}${item.year ? ` \u2014 ${item.year}` : ''}`}
                  </p>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
