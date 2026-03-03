# Copilot Review Instructions

Use these instructions when reviewing PRs in this repository.

## Context
- This app is a Next.js 16 + Sanity portfolio site for Alan Cross.
- The frontend was intentionally simplified from a prior block-heavy demo architecture.
- Main routes are `/`, `/blog`, `/blog/[slug]`, `/[slug]`, and `/studio`.
- Sanity `page` support is intentionally present and must remain wired end-to-end.
- Project summary notes live in `.github/project-notes.md`.

## Review Priorities (in order)
1. Functional regressions and runtime breakage.
2. Routing conflicts and content resolution issues.
3. Schema-query-fetch mismatches in Sanity integration.
4. SEO/sitemap correctness.
5. Type safety and data nullability handling.

## Required Checks
- Verify every referenced Sanity type is registered in `sanity/schema.ts`.
- Verify Studio structure entries only use existing schema types.
- Verify `internalLink` references support both `page` and `post`.
- Verify `/[slug]` does not shadow reserved paths (`index`, `blog`, `studio`, `api`).
- Verify `generateStaticParams` and metadata paths handle missing data safely.
- Verify sitemap output avoids duplicate canonical URLs.
- Verify blog URLs consistently use `/blog/...` (not legacy `/news/...`).

## Output Format for Reviews
- Report findings first, ordered by severity:
  - `High`: breakage/data loss/security
  - `Medium`: likely bug/regression
  - `Low`: maintainability/readability
- Include exact file paths and line references when possible.
- If no issues are found, explicitly say: `No blocking findings.`

## What to Avoid
- Do not suggest reintroducing removed legacy block systems unless the PR explicitly asks for it.
- Do not flag stylistic differences that align with existing project conventions.
- Do not request broad refactors when a localized fix is sufficient.
