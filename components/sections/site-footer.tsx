import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="border-t border-border px-12 py-8 max-md:px-6 max-md:pt-5 max-md:pb-7">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 max-md:grid-cols-1 max-md:justify-items-center max-md:gap-3">
        <p className="text-[0.82rem] tracking-[0.08em] text-text-muted max-md:order-2 max-md:text-center">
          &copy; {new Date().getFullYear()} Alan Cross. All rights reserved.
        </p>
        <p className="text-[0.82rem] tracking-[0.08em] text-text-muted text-center max-md:order-1">
          Website by{' '}
          <Link
            href="https://www.amcgarry.co.uk/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent transition-opacity duration-300 hover:opacity-80"
          >
            Alex McGarry
          </Link>
        </p>
      </div>
    </footer>
  );
}
