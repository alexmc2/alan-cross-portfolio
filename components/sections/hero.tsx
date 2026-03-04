import type { SiteSettings } from '@/types';
import { vimeoEmbedUrl } from '@/lib/utils';
import HeroVideo from './hero-video';

export default function Hero({ settings }: { settings: SiteSettings }) {
  const videoUrl = settings.heroVideo?.asset?.url;
  const externalVideoUrl = settings.heroVideoUrl
    ? vimeoEmbedUrl(settings.heroVideoUrl)
    : undefined;
  const height = settings.heroHeight || '75vh';
  const edgeStyle = settings.heroEdgeStyle || 'gradient';

  return (
    <section
      className="relative w-full min-h-[500px] overflow-hidden flex items-end"
      style={{ height }}
      id="home"
    >
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <HeroVideo
          uploadedVideoUrl={videoUrl}
          externalVideoUrl={externalVideoUrl ?? undefined}
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
          className="absolute inset-0 z-1"
          style={{
            background:
              'linear-gradient(to bottom, rgba(10,10,10,0.2), rgba(10,10,10,0) 30%, rgba(10,10,10,0) 50%, rgba(10,10,10,0.7) 80%, rgba(10,10,10,1))',
          }}
        />
      )}
      {edgeStyle === 'blur' && (
        <>
          <div
            className="absolute inset-0 z-1"
            style={{
              background:
                'linear-gradient(to bottom, rgba(10,10,10,0.3), transparent 40%, transparent 60%, rgba(10,10,10,0.5) 85%, rgba(10,10,10,1))',
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 z-1 h-24"
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
          className="absolute inset-0 z-1"
          style={{
            background:
              'linear-gradient(to bottom, rgba(10,10,10,0.3), transparent 30%, transparent 80%, rgba(10,10,10,0.6) 95%)',
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-2 px-12 pb-20 max-w-[800px] animate-fade-up max-md:px-6 max-md:pb-16 max-[380px]:pb-10">
        {settings.heroTagline && (
          <div className="text-[0.7rem] font-medium tracking-[0.25em] uppercase text-accent mb-5 flex items-center gap-3 max-[380px]:text-[0.6rem] max-[380px]:mb-3">
            <span className="block w-8 h-px bg-accent" />
            {settings.heroTagline}
          </div>
        )}
        {settings.heroTitle && (
          <h1 className="font-display text-[clamp(2rem,5vw,4.5rem)] font-bold leading-[1.1] tracking-[-0.02em] mb-5 max-[380px]:mb-3">
            {settings.heroTitle}
          </h1>
        )}
        {settings.heroSubtitle && (
          <p className="text-[1.1rem] font-light text-text-primary/70 max-w-[520px] leading-[1.8] max-[380px]:text-[0.95rem] max-[380px]:leading-[1.6]">
            {settings.heroSubtitle}
          </p>
        )}
      </div>
    </section>
  );
}
