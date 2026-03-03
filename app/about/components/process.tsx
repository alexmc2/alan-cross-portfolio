// app/about/components/process.tsx
import Link from 'next/link';
import { ArrowRight, PlayCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/ui/fade-in';

import { AboutSection } from './about-layout';
import { PROCESS_STEPS } from './content';

export default function Process() {
  return (
    <AboutSection sectionClassName="bg-muted/40">
      <FadeIn>
        <div className="text-center">
          <Badge variant="secondary" className="mb-4 inline-flex items-center gap-2">
            <PlayCircle className="h-3.5 w-3.5" aria-hidden />
            How it works
          </Badge>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Simple process, professional results
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Available for in-person meetings, or we can handle everything remotely. Whatever works best for you.
          </p>
        </div>
      </FadeIn>
      <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
        {PROCESS_STEPS.map(({ title, copy }, index) => (
          <FadeIn key={title} delay={index * 100}>
            <div className="h-full rounded-lg border border-dashed border-primary-2/20 bg-white/70 p-5 shadow-sm dark:bg-neutral-900/70">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-2">
                Step {index + 1}
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {title}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {copy}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
      <FadeIn delay={300}>
        <div className="mt-8 text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/demo/walkthrough">
              Watch the full walkthrough
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </FadeIn>
    </AboutSection>
  );
}
