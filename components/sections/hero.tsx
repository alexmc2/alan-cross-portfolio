import type { SiteSettings } from '@/types';
import { resolveExternalMediaSource } from '@/lib/utils';
import HeroVideo from './hero-video';

export default function Hero({ settings }: { settings: SiteSettings }) {
  const videoUrl = settings.heroVideo?.asset?.url;
  const videoMimeType = settings.heroVideo?.asset?.mimeType;
  const externalMedia = settings.heroVideoUrl
    ? resolveExternalMediaSource(settings.heroVideoUrl)
    : null;
  const height = settings.heroHeight || '75vh';
  const edgeStyle = settings.heroEdgeStyle || 'gradient';

  return (
    <section
      className="relative flex min-h-[500px] w-full items-end overflow-hidden"
      style={{ height }}
      id="home"
    >
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <HeroVideo
          uploadedVideoUrl={videoUrl}
          uploadedVideoMimeType={videoMimeType}
          externalMediaSrc={externalMedia?.src}
          externalMediaType={externalMedia?.mediaType}
          externalMediaMimeType={externalMedia?.mimeType}
          posterSrc="/hero-poster.webp"
          title={
            settings.heroTitle
              ? `${settings.heroTitle} — showreel`
              : 'Hero showreel video'
          }
        />
      </div>

      {/* Edge overlay */}
      {edgeStyle === 'gradient' && (
        <div
          aria-hidden="true"
          className="hero-edge-overlay absolute inset-0 z-10"
          style={{
            background:
              'linear-gradient(to bottom, rgba(10,10,10,0.2), rgba(10,10,10,0) 30%, rgba(10,10,10,0) 50%, rgba(10,10,10,0.7) 80%, rgba(10,10,10,1))',
          }}
        />
      )}
      {edgeStyle === 'blur' && (
        <>
          <div
            aria-hidden="true"
            className="hero-edge-overlay absolute inset-0 z-10"
            style={{
              background:
                'linear-gradient(to bottom, rgba(10,10,10,0.3), transparent 40%, transparent 60%, rgba(10,10,10,0.5) 85%, rgba(10,10,10,1))',
            }}
          />
          <div
            aria-hidden="true"
            className="hero-edge-overlay absolute bottom-0 left-0 right-0 z-10 h-24"
            style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              maskImage: 'linear-gradient(to bottom, transparent, black)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)',
            }}
          />
        </>
      )}
      {edgeStyle === 'solid' && (
        <div
          aria-hidden="true"
          className="hero-edge-overlay absolute inset-0 z-10"
          style={{
            background:
              'linear-gradient(to bottom, rgba(10,10,10,0.3), transparent 30%, transparent 80%, rgba(10,10,10,0.6) 95%)',
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-30 max-w-[800px] px-12 pb-20 animate-fade-up max-md:px-6 max-md:pb-16 max-[380px]:pb-10">
        {settings.heroTagline && (
          <div
            className="mb-5 flex items-center gap-3 text-[0.7rem] font-medium tracking-[0.25em] uppercase max-[380px]:mb-3 max-[380px]:text-[0.6rem]"
            style={{ color: 'var(--color-hero-text-secondary)' }}
          >
            <span
              className="block h-px w-8"
              style={{ backgroundColor: 'var(--color-hero-text-secondary)' }}
            />
            {settings.heroTagline}
          </div>
        )}
        {settings.heroTitle && (
          <h1
            className="mb-5 font-display text-[clamp(2rem,5vw,4.5rem)] font-bold leading-[1.1] tracking-[-0.02em] max-[380px]:mb-3"
            style={{ color: 'var(--color-hero-text-primary)' }}
          >
            {settings.heroTitle}
          </h1>
        )}
        {settings.heroSubtitle && (
          <p
            className="max-w-[520px] text-[1.1rem] font-light leading-[1.8] max-[380px]:text-[0.95rem] max-[380px]:leading-[1.6]"
            style={{ color: 'var(--color-hero-text-secondary)' }}
          >
            {settings.heroSubtitle}
          </p>
        )}
      </div>
    </section>
  );
}
