## Summary
- Redesigns the portfolio as a dark, minimal, single page, matched to `design/design-reference.html`.
- The page renders from typed content in `src/app/content/`. Supabase stays as the chat's knowledge base, and `db/seed.sql` is synced with the new copy.
- Styles move to SCSS (tokens, typography and motion partials). Scroll reveals use CSS animations and an IntersectionObserver. Reduced motion is respected.
- Adds a minimal corner-bracket cursor. It only turns on for a mouse or trackpad and hides over text fields.
- The page is prerendered with `@angular/ssr` and hydrated on load. The hire modal and chat widget are restyled and lazy-loaded with `@defer`.
- Adds SEO and social-preview tags plus a 1200×630 preview image.

## Testing
- `ng test`: 39 tests pass. `ng build`: clean, initial bundle about 254 kB raw.
- Lighthouse (local, uncompressed): Accessibility, Best Practices and SEO 100, layout shift 0. Performance is 76: the portrait fades in slowly, which delays the main image.
- The cursor was checked in Chromium only.

## Follow-ups
- Run `npm run db:seed` so the chat's database has the new copy.
- Decide whether to drop the portrait fade-in to speed up the main image.
- The `/api/content` endpoint is no longer used.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
