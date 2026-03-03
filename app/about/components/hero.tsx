// app/about/components/hero.tsx
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FadeIn } from '@/components/ui/fade-in';
import { cn } from '@/lib/utils';

import DemoCarousel from './demo-carousel';
import { HERO_CONTENT } from './content';
import MenuLottie from '@/components/blocks/menu/menu-lottie';
import { ABOUT_SECTION_DEFAULT_WIDTH } from './about-layout';

type HeroProps = {
  containerClassName?: string;
  sectionClassName?: string;
  titleClassName?: string;
};

export default function Hero({
  containerClassName,
  sectionClassName,
  titleClassName,
}: HeroProps = {}) {
  const resolvedContainerWidth =
    containerClassName ?? ABOUT_SECTION_DEFAULT_WIDTH;
  const resolvedTitleWidth = titleClassName ?? ABOUT_SECTION_DEFAULT_WIDTH;

  return (
    <section
      className={cn('relative overflow-hidden pb-16 pt-14', sectionClassName)}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-background to-background" />
      <div className={cn('mx-auto w-full px-6', resolvedContainerWidth)}>
        <div className="flex flex-col items-center text-center">
          <FadeIn delay={50}>
            <div className="mb-8 flex justify-center">
              <MenuLottie
                src="/lotties/cafe2.json"
                className="h-36 w-36 sm:h-48 sm:w-48"
                ariaLabel="Animated illustration"
                preserveAspectRatio="xMidYMid meet"
              />
            </div>
          </FadeIn>
          <FadeIn delay={100} className="w-full">
            <h1
              className={cn(
                'mx-auto w-full text-4xl font-semibold tracking-tight sm:text-6xl text-balance',
                resolvedTitleWidth
              )}
            >
              {HERO_CONTENT.title}
            </h1>
          </FadeIn>
          <FadeIn delay={200} className="w-full">
            <p className="mx-auto mt-4 text-lg text-muted-foreground">
              {HERO_CONTENT.description}
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/about/contact">Get in touch</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={HERO_CONTENT.walkthroughHref}>
                  Watch the walkthrough
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </FadeIn>
          <FadeIn delay={350} className="mt-10 w-full">
            <DemoCarousel images={HERO_CONTENT.carouselImages} />
          </FadeIn>
          <FadeIn delay={400} className="w-full">
            <ul className="mt-10 grid w-full gap-6 text-left sm:grid-cols-3">
              {HERO_CONTENT.benefits.map((item, index) => (
                <FadeIn key={item} delay={500 + index * 100} asChild>
                  <Card className="flex h-full flex-col items-center gap-4 border border-border/70 bg-card p-7 text-center text-base font-semibold leading-6 text-card-foreground shadow-md transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-neutral-900/80">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-soft-blue text-primary shadow-[0_25px_55px_-40px_rgba(14,165,233,0.65)] dark:bg-sky-blue/30 dark:text-sky-blue-foreground">
                      <CheckCircle2 className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="text-balance text-lg font-semibold leading-7 text-foreground dark:text-white/95">
                      {item}
                    </span>
                  </Card>
                </FadeIn>
              ))}
            </ul>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
