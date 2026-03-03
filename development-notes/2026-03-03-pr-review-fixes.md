# PR Review Fixes — 2026-03-03

Copilot reviewed the `feat/implement-mock-up` PR and left 11 comments.
After manual evaluation, 4 were actioned and 4 were dismissed as incorrect.

## Fixes applied

### 1. Sitemap `baseUrl` fallback not passed to GROQ helpers
**File:** `app/sitemap.ts`

`getPostsSitemap()` and `getPagesSitemap()` read `process.env.NEXT_PUBLIC_SITE_URL`
directly, bypassing the fallback (`|| "https://alanxai.com"`) computed in `sitemap()`.
If the env var is unset, GROQ would produce URLs like `undefined/blog/foo`.

**Fix:** Both helpers now accept `baseUrl` as a parameter. `sitemap()` passes its
computed fallback value to each.

### 2. Missing `aria-expanded` on mobile menu toggle
**File:** `components/nav.tsx`

The hamburger button had `aria-label` but no `aria-expanded` state, so screen readers
couldn't tell whether the menu was open or closed.

**Fix:** Added `aria-expanded={mobileOpen}` and `aria-controls="mobile-menu"` to the
button, and a matching `id="mobile-menu"` on the menu container.

### 3. iframe missing `title` attribute
**File:** `components/sections/hero.tsx`

The hero video iframe embed had no `title`, which is required for accessible naming.

**Fix:** Added `title` derived from `settings.heroTitle` with a sensible fallback.

### 4. `setTimeout` cleanup in `useReveal`
**File:** `components/use-reveal.tsx`

Timeout callbacks weren't cleared on unmount. Low practical impact (tiny delays,
class-only side effect), but technically a cleanup gap.

**Fix:** Timeout IDs are now tracked in a ref and cleared alongside
`observer.disconnect()` in the effect cleanup.

## Comments dismissed

### Tailwind v4 class syntax (4 comments)
Copilot flagged `z-1`, `z-2`, `z-100`, `duration-400`, and `duration-600` as invalid,
suggesting `z-[1]` / `duration-[400ms]` arbitrary-value syntax instead.

**Why dismissed:** This project uses Tailwind CSS v4 (`^4.1.11`), which generates
utility values on demand. All of these classes work natively in v4 without arbitrary
syntax. Copilot was applying Tailwind v3 knowledge where the default scale was fixed.

### Duplicate `query:` keys in sitemap (phantom)
Copilot's diff annotations showed duplicate `query:` properties in `sanityFetch` calls.
The actual file has no such duplication — each function uses its own query variable
correctly. This appears to be a Copilot hallucination from misreading the diff.
