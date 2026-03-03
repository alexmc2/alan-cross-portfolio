import type { SiteSettings } from "@/types";

export default function Hero({ settings }: { settings: SiteSettings }) {
  const videoUrl = settings.heroVideo?.asset?.url;
  const externalVideoUrl = settings.heroVideoUrl;

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-end" id="home">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        {videoUrl ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : externalVideoUrl ? (
          <iframe
            src={externalVideoUrl}
            className="w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
            title={settings.heroTitle ? `${settings.heroTitle} — showreel` : "Hero showreel video"}
          />
        ) : (
          <div
            className="w-full h-full relative"
            style={{ background: "linear-gradient(170deg, #1a1520, #0d1117 40%, #0a0f14 70%, #0a0a0a)" }}
          >
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-body text-[0.75rem] tracking-[0.3em] uppercase text-text-muted border border-text-muted px-8 py-4 opacity-50">
              &#9654; Showreel plays here
            </span>
          </div>
        )}
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-1"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.2), rgba(10,10,10,0) 30%, rgba(10,10,10,0) 50%, rgba(10,10,10,0.7) 80%, rgba(10,10,10,1))",
        }}
      />

      {/* Content */}
      <div className="relative z-2 px-12 pb-20 max-w-[800px] animate-fade-up max-md:px-6 max-md:pb-16">
        {settings.heroTagline && (
          <div className="text-[0.7rem] font-medium tracking-[0.25em] uppercase text-accent mb-5 flex items-center gap-3">
            <span className="block w-8 h-px bg-accent" />
            {settings.heroTagline}
          </div>
        )}
        {settings.heroTitle && (
          <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.1] tracking-[-0.02em] mb-5">
            {settings.heroTitle}
          </h1>
        )}
        {settings.heroSubtitle && (
          <p className="text-[1.1rem] font-light text-text-secondary max-w-[520px] leading-[1.8]">
            {settings.heroSubtitle}
          </p>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-12 z-2 flex flex-col items-center gap-2 animate-fade-in opacity-0 max-md:hidden">
        <span className="text-[0.6rem] tracking-[0.2em] uppercase text-text-muted [writing-mode:vertical-rl]">
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-text-muted to-transparent animate-scroll-pulse" />
      </div>
    </section>
  );
}
