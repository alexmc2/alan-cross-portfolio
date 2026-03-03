// app/about/walkthrough/page.tsx
export const revalidate = 0;

import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function DemoWalkthroughPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Button
        asChild
        variant="ghost"
        className="mb-8  text-muted-foreground hover:text-foreground"
      >
        <Link href="/about">← Back</Link>
      </Button>

      <div className="mb-10 text-center">
        <Badge variant="outline" className="mb-4">
          Video walkthrough
        </Badge>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          How the content editor works
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          This 5-minute video shows how to update content, change photos, and edit
          text. You'll get login details after setup.
        </p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/40">
          <CardTitle className="text-base font-semibold">
            Editor tutorial
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Editing content, updating pages, and publishing changes.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              src="https://www.loom.com/embed/f7854470fb5140a5bdf03afb16e6a953?hide_owner=true&hide_share=true&hide_title=true"
              allow="autoplay; fullscreen; picture-in-picture"
              className="absolute inset-0 h-full w-full border-0"
              title="Portfolio website editor walkthrough"
            />
          </div>
        </CardContent>
      </Card>

      <div className="mt-10 text-center">
        <p className="text-sm text-muted-foreground mb-6">
          Questions? Send me an email.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <a href="mailto:hello@amcgarry.co.uk?subject=Question%20about%20portfolio%20website">
              Email me
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">View demo site</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
