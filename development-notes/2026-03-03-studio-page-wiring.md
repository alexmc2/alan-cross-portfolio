# 2026-03-03 - Studio `page` Type Fix + Full Page Wiring

## Why this change was needed
- `/studio` was crashing with `Unknown type: page`.
- Root cause: Portable Text internal link fields referenced `{ type: "page" }`, but `page` was not registered in the active Sanity schema.
- Immediate hotfix (earlier in this session) removed `page` from link targets to unblock Studio.
- Final goal from follow-up: wire `page` back in properly so internal links can target both pages and blog posts.

## What was changed

### 1) Reintroduced a valid `page` document type
- Added [sanity/schemas/documents/page.ts](/home/alex/projects/demo-sites/alan-cross-portfolio/sanity/schemas/documents/page.ts).
- Schema includes:
  - `title` (required)
  - `slug` (required)
  - `body` (`block-content`)
  - SEO fields: `meta_title`, `meta_description`, `noindex`, `ogImage`
  - preview config showing title + slug

### 2) Registered `page` in the schema bundle
- Updated [sanity/schema.ts](/home/alex/projects/demo-sites/alan-cross-portfolio/sanity/schema.ts) to import and include `page` in `schema.types`.

### 3) Added Pages to Studio structure
- Updated [sanity/structure.ts](/home/alex/projects/demo-sites/alan-cross-portfolio/sanity/structure.ts) to include a `Pages` section (`documentTypeList("page")`).

### 4) Restored internal link targets to include pages
- Updated [sanity/schemas/blocks/shared/block-content.ts](/home/alex/projects/demo-sites/alan-cross-portfolio/sanity/schemas/blocks/shared/block-content.ts) `internalLink.to` back to:
  - `{ type: "page" }`
  - `{ type: "post" }`
- Updated [sanity/schemas/blocks/shared/link.ts](/home/alex/projects/demo-sites/alan-cross-portfolio/sanity/schemas/blocks/shared/link.ts) with the same target list.

### 5) Added page GROQ queries
- Added [sanity/queries/page.ts](/home/alex/projects/demo-sites/alan-cross-portfolio/sanity/queries/page.ts):
  - `PAGE_QUERY`
  - `PAGES_SLUGS_QUERY`

### 6) Added page fetch helpers
- Updated [sanity/lib/fetch.ts](/home/alex/projects/demo-sites/alan-cross-portfolio/sanity/lib/fetch.ts):
  - `fetchSanityPageBySlug`
  - `fetchSanityPagesStaticParams`

### 7) Added frontend route for page documents
- Added [app/(main)/[slug]/page.tsx](/home/alex/projects/demo-sites/alan-cross-portfolio/app/(main)/[slug]/page.tsx).
- Behavior:
  - SSG via `generateStaticParams`
  - metadata from page SEO fields
  - renders page `title` + `body` using existing `PortableTextRenderer`
  - protects reserved slugs (`index`, `blog`, `studio`, `api`) from dynamic page rendering

### 8) Added page URLs to sitemap
- Updated [app/sitemap.ts](/home/alex/projects/demo-sites/alan-cross-portfolio/app/sitemap.ts) to include non-reserved `page` documents.
- Excludes `index`, `blog`, and `studio` to avoid duplicate/conflicting sitemap entries.

### 9) Added local type for page data
- Updated [types/index.d.ts](/home/alex/projects/demo-sites/alan-cross-portfolio/types/index.d.ts) with a `Page` type used by the new dynamic route.

## Validation
- Ran `npm run build` successfully after changes.
- Build output confirms these routes compile:
  - `/studio/[[...tool]]`
  - `/[slug]`
  - `/blog`
  - `/blog/[slug]`

## Result
- Studio no longer errors on unknown `page` type.
- Internal links can target both pages and blog posts again.
- `page` documents are now fully wired from CMS schema to frontend route and sitemap.
