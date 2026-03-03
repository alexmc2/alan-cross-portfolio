// components/404.tsx
'use client';

// components/404.tsx
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button1';

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
});

const animationSources = {
  dark: '/lotties/404-error-dark.json',
  light: '/lotties/404-error-light.json',
} as const;

export default function Custom404() {
  const { resolvedTheme } = useTheme();
  const [animationData, setAnimationData] = useState<Record<string, unknown> | null>(null);

  const activeTheme = resolvedTheme === 'dark' ? 'dark' : 'light';

  const animationPath = useMemo(() => animationSources[activeTheme], [activeTheme]);

  useEffect(() => {
    let isMounted = true;

    async function loadAnimation() {
      try {
        const response = await fetch(animationPath);
        if (!response.ok) return;
        const data = await response.json();
        if (isMounted) {
          setAnimationData(data);
        }
      } catch (error) {
        if (isMounted) {
          setAnimationData(null);
        }
      }
    }

    loadAnimation();

    return () => {
      isMounted = false;
    };
  }, [animationPath]);

  return (
    <div className="relative z-20 min-h-[80vh] flex items-center justify-center">
      <div className="relative px-6 md:px-0 py-[4rem] sm:py-[5rem] md:py-[6.25rem] mx-auto w-full sm:max-w-[37.5rem] md:max-w-[40.625rem] lg:max-w-[53.125rem] xl:max-w-[70rem]">
        <div className="mx-auto mb-0 flex w-full max-w-[16rem] sm:max-w-[20rem] md:max-w-[24rem] items-center justify-center">
          {animationData ? (
            <Lottie
              animationData={animationData}
              loop
              autoplay
              aria-hidden="true"
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <div
              className="h-32 w-full animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-700"
              aria-hidden="true"
            />
          )}
        </div>
        <h1 className="text-center font-bold text-[9.9vw] sm:text-[3.4375rem] md:text-[4.5rem] lg:text-[6rem] xl:text-[8rem] leading-[1.12]">
          Page not found
        </h1>
        <div className="mt-5 text-center">
          <Button size="lg" asChild className='default'>
            <Link href="/">Back to Home page</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
