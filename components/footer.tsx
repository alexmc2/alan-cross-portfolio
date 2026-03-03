// components/footer.tsx
import Logo from '@/components/logo';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button1';
import { cn } from '@/lib/utils';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { fetchSanitySettings, fetchSanityNavigation } from '@/sanity/lib/fetch';
import { NAVIGATION_QUERYResult } from '@/sanity.types';

type SanityLink = NonNullable<NAVIGATION_QUERYResult[0]['links']>[number];

export default async function Footer() {
  const settings = await fetchSanitySettings();
  const navigation = await fetchSanityNavigation();

  return (
    <footer>
      <div className="dark:bg-background py-6 dark:text-gray-300 text-center">
        <div className="mx-auto flex w-full max-w-full flex-col items-center gap-y-8 pt-4">
          <Link
            href="/"
            className="inline-block text-center"
            aria-label="Home page"
          >
            <Logo
              settings={settings}
              variant="footer"
              className="block"
            />
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-7 text-primary">
            {navigation[0]?.links?.map((navItem: SanityLink) => (
              <Link
                key={navItem._key}
                href={navItem.href || '#'}
                prefetch={false}
                target={navItem.target ? '_blank' : undefined}
                rel={navItem.target ? 'noopener noreferrer' : undefined}
                className={cn(
                  buttonVariants({
                    variant: navItem.buttonVariant || 'default',
                  }),
                  navItem.buttonVariant === 'ghost' &&
                    'transition-colors text-foreground hover:text-foreground/80 text-sm p-0 h-auto hover:bg-transparent'
                )}
              >
                {navItem.title}
              </Link>
            ))}
          </div>
          <div className="flex w-full items-center justify-center border-t border-foreground/10 pt-6 text-xs">
            <div className="flex items-center gap-2 text-foreground">
              <span>&copy; {new Date().getFullYear()}</span>
              {settings?.copyright && (
                <span className="[&>p]:!m-0">
                  <PortableTextRenderer value={settings.copyright} />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
