// app/about/page.tsx
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/fade-in';
import { cn } from '@/lib/utils';
import DemoCarousel from './components/demo-carousel';
import { HERO_CONTENT } from './components/content';

import MenuLottie from '@/components/blocks/menu/menu-lottie';
import { ABOUT_SECTION_DEFAULT_WIDTH } from '../about/components/about-layout';

type HeroProps = {
  containerClassName?: string;
  sectionClassName?: string;
};

const CONTACT_EMAIL = 'alexandramcgarryx@gmail.com';

function Hero({
  containerClassName,
  sectionClassName,
}: HeroProps = {}) {
  const resolvedContainerWidth =
    containerClassName ?? ABOUT_SECTION_DEFAULT_WIDTH;

  return (
    <section
      className={cn(
        'relative overflow-hidden py-12 sm:py-20',
        sectionClassName
      )}
    >
      <div className={cn('mx-auto w-full px-6', resolvedContainerWidth)}>
        <div className="flex flex-col items-center text-center">
          {/* Lottie animation */}
          <FadeIn delay={50}>
            <div className="mb-6 flex justify-center">
              <MenuLottie
                src="/lotties/cafe2.json"
                className="h-28 w-28 sm:h-40 sm:w-40"
                ariaLabel="Animated illustration"
                preserveAspectRatio="xMidYMid meet"
              />
            </div>
          </FadeIn>

          {/* Main headline - huge and simple */}
          <FadeIn delay={100} className="w-full">
            <h1 className="mx-auto mb-6 text-5xl font-bold tracking-tight sm:text-7xl">
              A professional website
              <br />
              for your portfolio
            </h1>
          </FadeIn>

          {/* Subheadline - bigger and clearer */}
          <FadeIn delay={150} className="w-full">
            <p className="mx-auto mb-4 max-w-2xl text-2xl text-muted-foreground sm:text-3xl">
              Update your website yourself.
              <br />
              No monthly fees.
            </p>
          </FadeIn>

          {/* Price - front and center */}
          <FadeIn delay={200}>
            <div className="mb-10 rounded-2xl bg-sky-50 px-8 py-4 dark:bg-sky-900/30">
              <p className="mb-1 text-sm font-medium uppercase tracking-wide text-sky-700 dark:text-sky-300">
                Introductory Offer
              </p>
              <p className="text-xl font-semibold text-sky-900 dark:text-sky-100 sm:text-2xl">
                £150 setup · No payment until it's live
              </p>
            </div>
          </FadeIn>

          {/* Big, obvious CTAs */}
          <FadeIn delay={300}>
            <div className="mb-14 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-16 px-10 text-xl">
                <Link href="/">See the full demo →</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-16 px-10 text-xl"
              >
                <Link href="/about/contact">Get in touch</Link>
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={250} className="mb-12 w-full">
            <div className="overflow-hidden rounded-2xl border-4 border-gray-100 shadow-2xl dark:border-gray-800">
              <DemoCarousel images={HERO_CONTENT.carouselImages} />
            </div>
          </FadeIn>

          {/* Video - embedded directly */}
          <FadeIn delay={250} className="mb-12 w-full">
            <h2 className="mb-4 text-xl font-semibold text-muted-foreground">
              Walkthrough
            </h2>
            <div className="overflow-hidden rounded-2xl border-4 border-gray-100 shadow-2xl dark:border-gray-800">
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                <iframe
                  src="https://www.loom.com/embed/f7854470fb5140a5bdf03afb16e6a953?hide_owner=true&hide_share=true&hide_title=true"
                  allow="autoplay; fullscreen; picture-in-picture"
                  className="absolute inset-0 h-full w-full border-0"
                  title="How the website editor works"
                />
              </div>
            </div>
            <p className="mt-4 text-lg text-muted-foreground">
              5-minute video showing exactly how to update your website yourself
            </p>
          </FadeIn>

          {/* Big, obvious CTAs */}
          <FadeIn delay={300}>
            <div className="mb-14 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-16 px-10 text-xl">
                <Link href="/">See the full demo →</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-16 px-10 text-xl"
              >
                <Link href="/about/contact">Get in touch</Link>
              </Button>
            </div>
          </FadeIn>

          {/* Three simple benefits */}
          <FadeIn delay={350} className="w-full">
            <div className="grid gap-6 text-left sm:grid-cols-3">
              <div className="rounded-xl bg-soft-blue p-6 dark:bg-sky-900/20">
                <CheckCircle className="mb-3 h-8 w-8 text-sky-600 dark:text-sky-400" />
                <p className="text-lg font-semibold leading-snug">
                  Update your content instantly
                </p>
              </div>
              <div className="rounded-xl bg-soft-blue p-6 dark:bg-sky-900/20">
                <CheckCircle className="mb-3 h-8 w-8 text-sky-600 dark:text-sky-400" />
                <p className="text-lg font-semibold leading-snug">
                  Add photos from your phone
                </p>
              </div>
              <div className="rounded-xl bg-soft-blue p-6 dark:bg-sky-900/20">
                <CheckCircle className="mb-3 h-8 w-8 text-sky-600 dark:text-sky-400" />
                <p className="text-lg font-semibold leading-snug">
                  One payment, yours forever
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Simple proof */}
          <FadeIn delay={400} className="mt-14 w-full">
            <div className="rounded-2xl border border-border bg-muted/40 p-8">
              <p className="mb-2 text-lg font-semibold">
                Cambridge-based developer, happy to meet in person
              </p>
              <p className="text-muted-foreground">
                {CONTACT_EMAIL} · 07793 565 433
              </p>
            </div>
          </FadeIn>

          {/* Ongoing support */}
          <FadeIn delay={450} className="mt-12 w-full">
            <div className="rounded-2xl border-2 border-sky-200 bg-white p-8 dark:border-sky-800 dark:bg-gray-900">
              <h2 className="mb-4 text-2xl font-bold">
                Ongoing support available
              </h2>
              <p className="mb-6 text-lg text-muted-foreground">
                After setup, you can update everything yourself. But if you'd
                prefer ongoing help:
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-sky-50 p-6 dark:bg-sky-900/20">
                  <p className="mb-2 text-xl font-semibold">
                    £10/month (Introductory offer)
                  </p>
                  <p className="text-muted-foreground">
                    Hosting, updates when you need them, and email support
                  </p>
                </div>
                <div className="rounded-lg bg-sky-50 p-6 dark:bg-sky-900/20">
                  <p className="mb-2 text-xl font-semibold">Pay-as-you-go</p>
                  <p className="text-muted-foreground">
                    Just email me when you need changes.
                  </p>
                </div>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Optional. Many clients prefer to manage everything themselves
                after the initial set up.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return <Hero />;
}
