// app/about/components/pricing.tsx
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/fade-in';

import { AboutSection } from './about-layout';
import { PRICING_CONTENT } from './content';

export default function Pricing() {
  const {
    badgeLabel,
    priceLabel,
    description,
    highlight,
    walkthroughHref,
    footnote,
  } = PRICING_CONTENT;

  return (
    <AboutSection>
      <FadeIn>
        <div className="text-center">
          <Badge variant="outline" className="mb-4">
            {badgeLabel}
          </Badge>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {priceLabel}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
            {description}
          </p>
        </div>
      </FadeIn>
      <FadeIn delay={100}>
        <div className="mt-6 inline-flex items-center gap-3 rounded-lg bg-primary-2/10 px-5 py-3 text-sm font-medium text-primary-2">
          <Sparkles className="h-4 w-4" aria-hidden />
          {highlight}
        </div>
      </FadeIn>
      <FadeIn delay={200}>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/about/contact">Get in touch</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={walkthroughHref}>
              Watch the walkthrough
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </FadeIn>
      <FadeIn delay={300}>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          {footnote}
        </p>
      </FadeIn>
    </AboutSection>
  );
}
