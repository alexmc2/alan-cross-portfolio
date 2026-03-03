# Git Notes - Alan Cross Portfolio

## Scope Snapshot
- Project migrated from a larger cafe-demo/content-block architecture to a focused Alan Cross portfolio implementation.
- Core routes are now:
  - `/` (single-page portfolio)
  - `/blog` and `/blog/[slug]`
  - `/[slug]` for CMS-managed generic pages
  - `/studio` for Sanity Studio
- Sanity Studio schema mismatch (`Unknown type: page`) was fixed by fully wiring `page` back into schema, Studio structure, queries, fetchers, routing, and sitemap.

## Primary Functional Changes
- Replaced previous multi-block frontend with simplified portfolio section components:
  - `hero`, `work`, `about`, `services`, `contact`, `site-footer`
- Shifted article pathing to blog-first URLs:
  - old `/news/[slug]` -> `/blog/[slug]`
- Added dynamic page rendering for CMS documents:
  - `app/(main)/[slug]/page.tsx`
  - reserved slug guard for `index`, `blog`, `studio`, `api`
- Reintroduced `page` document support and internal linking:
  - `to: [{ type: "page" }, { type: "post" }]`
- Added page entries to sitemap while excluding reserved/duplicate slugs.

## Data Model Status
- Active Sanity document models:
  - `siteSettings` (singleton)
  - `portfolioItem`
  - `service`
  - `page`
  - `post`
  - `socialLink`
- Shared content model:
  - `block-content`

## Validation
- `npm run build` passes after wiring updates.
- Build confirms static/SSG coverage for:
  - `/`
  - `/blog`
  - `/blog/[slug]`
  - `/[slug]`
  - `/studio/[[...tool]]`

## Reviewer Focus Areas
- Confirm no route collisions between `/[slug]` and existing top-level routes.
- Confirm Studio internal links resolve correctly for both `page` and `post`.
- Confirm sitemap includes intended page docs and excludes reserved slugs.
- Confirm no regressions in blog metadata and Portable Text link rendering.

## Related Notes
- Base implementation notes:
  - `development-notes/initial-setup.md`
- Studio/page wiring details:
  - `development-notes/2026-03-03-studio-page-wiring.md`
