// app/about/components/features.tsx
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn } from '@/components/ui/fade-in';

import { AboutSection } from './about-layout';
import { FEATURES } from './content';

type FeaturesProps = {
  maxWidthClassName?: string;
};

export default function Features({
  maxWidthClassName,
}: FeaturesProps = {}) {
  return (
    <AboutSection maxWidthClassName={maxWidthClassName}>
      <FadeIn>
        <div className="mb-10 text-center">
          <Badge variant="outline" className="mb-4">
            Features
          </Badge>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Built for independent businesses
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
            Everything you need for a professional portfolio website. Update pages, photos, and information yourself - no technical knowledge required.
          </p>
        </div>
      </FadeIn>
      <div className="grid gap-6 sm:grid-cols-3">
        {FEATURES.map(({ title, description, icon: Icon }, index) => (
          <FadeIn key={title} delay={index * 100}>
            <Card className="h-full">
              <CardHeader className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-2/10 text-primary-2">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <CardTitle className="text-base font-semibold text-foreground">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-6 text-muted-foreground">
                  {description}
                </CardDescription>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>
    </AboutSection>
  );
}
