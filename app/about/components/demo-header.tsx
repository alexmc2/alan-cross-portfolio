// app/about/components/demo-header.tsx
// 'use client';

// // components/demo/demo-header.tsx
// import Logo from '@/components/logo';
// import { ModeToggle } from '@/components/menu-toggle';
// import type { DEMO_SETTINGS_QUERYResult } from '@/sanity.types';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import type { ReactNode } from 'react';
// import { useMemo } from 'react';
// import { cn } from '@/lib/utils';

// const FALLBACK_SITE_NAME =
//   process.env.NEXT_PUBLIC_DEMO_SITE_NAME?.trim() || 'Alan Cross Portfolio';

// type NavLink = {
//   title: string;
//   href: string;
//   _key?: string;
// };

// const FALLBACK_NAV_LINKS: NavLink[] = [
//   { title: 'How it works', href: '/about' },
//   { title: 'Full website', href: '/' },
//   { title: 'Book a call', href: 'mailto:hello@alancrossportfolio.com' },
// ];

// const FALLBACK_CONTACT_CTA = {
//   label: 'Book a call',
//   href: 'mailto:hello@alancrossportfolio.com',
// } as const;

// type DemoSettingsShape = NonNullable<DEMO_SETTINGS_QUERYResult>;

// type DemoHeaderProps = {
//   settings?: DEMO_SETTINGS_QUERYResult | null;
// };

// function isInternalLink(href: string) {
//   return href.startsWith('/') && !href.startsWith('//');
// }



// export default function DemoHeader({ settings }: DemoHeaderProps = {}) {
//   const pathname = usePathname();
//   const demoSettings = settings ?? undefined;

//   const siteName = demoSettings?.siteName?.trim() || FALLBACK_SITE_NAME;





//   const contactCtaFromSettings = demoSettings?.contactCta;

//   const contactCta =
//     contactCtaFromSettings?.label?.trim() &&
//     contactCtaFromSettings?.href?.trim()
//       ? {
//           label: contactCtaFromSettings.label.trim(),
//           href: contactCtaFromSettings.href.trim(),
//         }
//       : hasFallbackContact
//         ? FALLBACK_CONTACT_CTA
//         : undefined;

//   let contactCtaNode: ReactNode = null;

//   if (contactCta) {
//     const internal = isInternalLink(contactCta.href);
//     const contactLinkClass =
//       'hidden items-center whitespace-nowrap text-slate-700 transition-colors hover:text-[var(--primary)] dark:text-primary-foreground/80 dark:hover:text-primary-foreground sm:inline-flex';

//     contactCtaNode = internal ? (
//       <Link href={contactCta.href} className={contactLinkClass}>
//         {contactCta.label}
//       </Link>
//     ) : (
//       <a
//         href={contactCta.href}
//         className={contactLinkClass}
//         target={contactCta.href.startsWith('http') ? '_blank' : undefined}
//         rel={
//           contactCta.href.startsWith('http') ? 'noreferrer noopener' : undefined
//         }
//       >
//         {contactCta.label}
//       </a>
//     );
//   }

//   const brandSettings = demoSettings
//     ? {
//         siteName,
//         headerLogo: demoSettings.headerLogo,
//         showSiteNameInHeader: demoSettings.showSiteNameInHeader,
//       }
//     : { siteName };

//   return (
//     <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/90 text-slate-900 shadow-sm backdrop-blur supports-backdrop-blur:bg-white/80 dark:border-white/10 dark:bg-[#020817]/85 dark:text-primary-foreground">
//       <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
//         <Link
//           href="/about"
//           className="flex items-center gap-3 text-lg font-semibold tracking-tight"
//           aria-label={`${siteName} home`}
//         ></Link>
//         <div className="flex items-center gap-4 text-sm font-medium">
//           <nav className="flex items-center gap-4">
//             {activeNavLinks.map((link) => {
//               const key = link._key ?? `${link.title}-${link.href}`;
//               if (isInternalLink(link.href)) {
//                 const isActive =
//                   pathname === link.href ||
//                   (link.href !== '/' && pathname.startsWith(link.href));
//                 return (
//                   <Link
//                     key={key}
//                     href={link.href}
//                     className={cn(
//                       'transition-colors',
//                       isActive
//                         ? 'text-[var(--primary)]'
//                         : 'text-slate-700 hover:text-[var(--primary)] dark:text-primary-foreground/80 dark:hover:text-primary-foreground'
//                     )}
//                   >
//                     {link.title}
//                   </Link>
//                 );
//               }

//               return (
//                 <a
//                   key={key}
//                   href={link.href}
//                   className="transition-colors text-slate-700 hover:text-[var(--primary)] dark:text-primary-foreground/80 dark:hover:text-primary-foreground"
//                   target={link.href.startsWith('http') ? '_blank' : undefined}
//                   rel={
//                     link.href.startsWith('http')
//                       ? 'noreferrer noopener'
//                       : undefined
//                   }
//                 >
//                   {link.title}
//                 </a>
//               );
//             })}
//           </nav>
//           {contactCtaNode}
//           <ModeToggle className="ml-1 text-base text-slate-700 hover:text-[var(--primary)] dark:text-primary-foreground" />
//         </div>
//       </div>
//     </header>
//   );
// }
