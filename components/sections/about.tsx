import type { SiteSettings } from '@/types';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';

const aboutImagePositions = {
  top: '50% 12%',
  upper: '50% 26%',
  center: '50% 50%',
  lower: '50% 68%',
  bottom: '50% 84%',
} as const;

export default function About({ settings }: { settings: SiteSettings }) {
  const objectPosition =
    aboutImagePositions[settings.aboutImagePosition ?? 'upper'];

  return (
    <section
      id="about"
      className="pt-36 pb-28 px-12 max-md:pt-28 max-md:pb-20 max-md:px-6"
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 gap-20 items-start max-[900px]:grid-cols-1 max-[900px]:gap-12">
        {/* Text column */}
        <div className="reveal">
          <div className="slabel">About</div>
          {settings.aboutHeading && (
            <h2 className="font-display text-[clamp(1.8rem,3vw,2.8rem)] font-semibold leading-[1.2] mb-8">
              {settings.aboutHeading}
            </h2>
          )}
          {settings.aboutBody && (
            <div className="text-text-secondary text-base [&>p]:mb-5 [&>p]:max-w-[480px] max-[900px]:[&>p]:max-w-full [&>p]:leading-[1.7]">
              <PortableText value={settings.aboutBody} />
            </div>
          )}
          {settings.stats && settings.stats.length > 0 && (
            <div className="flex gap-12 mt-10 pt-8 border-t border-border max-[550px]:flex-wrap max-[550px]:gap-6">
              {settings.stats.map((stat) => (
                <div key={stat._key} className="flex flex-col">
                  <span className="font-display text-[2rem] font-bold text-accent leading-none">
                    {stat.number}
                  </span>
                  <span className="text-[0.7rem] tracking-[0.15em] uppercase text-text-muted mt-2">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Image column */}
        <div className="relative w-full max-w-[420px] justify-self-end aspect-[3/4] bg-bg-card overflow-hidden reveal max-[900px]:max-w-none max-[900px]:max-h-[300px] max-[900px]:w-full max-[900px]:mx-auto">
          {settings.aboutImage?.asset ? (
            <Image
              src={urlFor(settings.aboutImage).width(500).fit('max').url()}
              alt="About Alan Cross"
              fill
              className="object-cover"
              style={{ objectPosition }}
              sizes="500px"
              placeholder={
                settings.aboutImage.asset.metadata?.lqip ? 'blur' : undefined
              }
              blurDataURL={settings.aboutImage.asset.metadata?.lqip}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-[0.7rem] tracking-[0.2em] uppercase text-text-muted"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-bg-card), #1a1816)',
              }}
            >
              Photo
            </div>
          )}
          {/* Decorative gold corner accent */}
          <div className="absolute -top-4 -right-4 w-20 h-20 border-t border-r border-accent opacity-30 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
