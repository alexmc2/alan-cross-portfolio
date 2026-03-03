# Alan Cross Portfolio — Project Memory

## Architecture
- **Framework**: Next.js 16 (App Router) + Sanity CMS + Tailwind CSS v4
- **Design**: Dark-only portfolio site (no light mode). Design reference: `alan-cross-mockup.html`
- **Deployment target**: alanxai.com via Vercel
- **Fonts**: Syne (display, `--font-display`) + Outfit (body, `--font-body`) via `next/font/google`
- **Colors**: bg-primary #0a0a0a, bg-elevated #111, bg-card #161616, accent #c8a46e, text-primary #f0ece6

## Key Routes
- `/` — Single-page homepage (hero, work, about, services, contact, footer)
- `/blog` — Blog listing
- `/blog/[slug]` — Individual blog post
- `/studio` — Sanity Studio (preserved from cafe-demo)

## Sanity Schemas
- `siteSettings` (singleton) — hero, about, contact, SEO fields
- `portfolioItem` — title, slug, category, vimeoUrl, thumbnail, featured, order
- `service` — title, description, icon (unicode), order
- `post` — title, slug, publishedAt, excerpt, mainImage, category, body (Portable Text)
- `socialLink` — platform, url, order
- `block-content` (shared object) — Portable Text with images, YouTube, code blocks

## File Structure
- Schemas: `sanity/schemas/documents/`
- Queries: `sanity/queries/` (siteSettings.ts, portfolioItem.ts, service.ts, post.ts, socialLink.ts)
- Fetch functions: `sanity/lib/fetch.ts`
- Components: `components/nav.tsx`, `components/sections/` (hero, work, about, services, contact, site-footer)
- Types: `types/index.d.ts`
- Sanity infra: `sanity/lib/` (client, image, live, token), `sanity/env.ts`

## Notes
- Video in hero: supports Sanity file upload OR external URL fallback
- Portfolio items link to Vimeo URLs (opens in new tab)
- Scroll reveal animation via IntersectionObserver (`.reveal` / `.visible` CSS classes)
- The `.slabel` CSS class creates the gold-line-and-text section label pattern
- `sanity.types.ts` is auto-generated — don't edit manually
