# Joan Cruzat Portfolio — Angular + Vercel

A dark, single-page Angular portfolio, prerendered to static HTML at build time. Page copy lives in typed files under `src/app/content/`. Vercel functions send "Get in touch" inquiries through Resend and power the AI chat assistant, whose knowledge comes from Supabase Postgres.

The approved visual design is [`design/design-reference.html`](design/design-reference.html).

## Architecture

```text
Browser (Angular 21, zoneless, signals, prerendered + hydrated)
  page copy          -> src/app/content/*.ts (compiled in, no request)
  POST /api/chat     -> api/chat.js     -> Supabase content -> system prompt -> Claude
  POST /api/contact  -> api/contact.js  -> Resend -> Joan's inbox
```

| Path | Responsibility |
|---|---|
| `src/app/content/` | All page copy and links: `site.ts`, `projects.ts`, `experience.ts`, `principles.ts`, `stack.ts` |
| `src/app/layout/` | Sticky nav and footer |
| `src/app/sections/` | Page sections: hero, marquee, work, approach, experience, contact |
| `src/app/ui/` | Presentational pieces: portrait stage, project row, principle card, architecture diagram, count-up |
| `src/app/directives/` | `appReveal` scroll-reveal directive and the shared IntersectionObserver helper |
| `src/app/features/hire/` | "Get in touch" dialog (typed reactive form), lazy-loaded with `@defer` |
| `src/app/features/chat/` | AI chat widget, lazy-loaded with `@defer (on idle)` |
| `src/styles/` | `_tokens.scss` (design tokens), `_typography.scss`, `_motion.scss` (keyframes, reveal states, reduced motion) |
| `api/_lib/` | Shared function code (not deployed as endpoints) |
| `db/` | SQL migrations and the chat's content seed |

## Editing the site

**Copy, projects, experience, principles, stack.** Edit the matching file in `src/app/content/`. Templates loop over these arrays, so adding a project is adding an object to `PROJECTS`. A project's `result` is either `{ kind: 'metric', value, label }` (big number) or `{ kind: 'note', text }` (muted text; `\n` breaks the line). Set `caseStudyUrl` on a project to turn its whole row into a link.

**Keep the chat in sync.** The chat assistant answers from `db/seed.sql`, not from the TypeScript files. When you change facts (years, roles, projects), update the seed too and run `npm run db:seed`.

**Swap the portrait.** Replace `src/assets/images/joan-portrait.webp` with a background-removed image. If its pixel size changes, update `width`/`height` on the `<img>` in `src/app/ui/portrait-stage.ts` so the layout doesn't shift. Regenerate `src/assets/images/og-image.png` (1200×630, used for social previews) if the hero changes.

**Change the accent colour.** Edit `--accent` in `src/styles/_tokens.scss`. Glows and borders derive from it with `color-mix()`.

**Résumé.** Replace `src/assets/resume.pdf`.

**Motion.** Hero entrance, portrait float and marquee are CSS animations. Sections use the `appReveal` directive (`appReveal="left"` slides in from the left, `[revealIndex]` staggers by 80 ms). Under `prefers-reduced-motion: reduce` every animation is off and the counter shows 9 immediately. Without JavaScript, everything renders visible.

## 1. Local development

```bash
npm install
npx vercel env pull .env.local
```

`npm start` serves the page on its own (copy is compiled in). To exercise the chat and contact form too, run the `/api` functions alongside it with Vercel's dev server:

```bash
npx vercel dev
```

`vercel dev` reads only `.env`, so it must contain `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` (copy them from `.env.local`; both are safe to expose because row-level security makes the key read-only), plus the Resend and Anthropic keys. Without the Supabase values the chat can't load its knowledge and answers with an error.

Tests and checks:

```bash
npm test            # Angular unit tests (Vitest)
npm run test:api    # API unit tests (node:test)
npm run verify      # static security and wiring checks
npm run build
```

## 2. Chat knowledge base

The chat assistant's knowledge is in [`db/seed.sql`](db/seed.sql). Edit it, then apply it:

```bash
npm run db:seed
```

The seed rewrites every content table in one transaction. The chat picks up changes within about 5 minutes (function cache).

Schema changes go in a new numbered file in `db/migrations/` (never edit an applied one), applied with:

```bash
npm run db:migrate
```

Both commands use `POSTGRES_URL_NON_POOLING` from `.env.local` (the database owner connection). That connection is only used locally; deployed functions read content with the publishable key, which row-level security limits to `SELECT`.

## 3. Create your Resend account

Resend currently has a free transactional tier of 3,000 emails/month and 100 emails/day. See the current pricing before relying on the limits.

Create an API key in Resend and keep it server-side.

For the simplest first deployment, you can use `onboarding@resend.dev` as the sender while testing. For a real portfolio, verify a domain in Resend and use an address on that domain.

## 4. Vercel environment variables

In Vercel:
Project -> Settings -> Environment Variables

The Supabase integration adds `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` and the Postgres connection strings automatically. Add:

```text
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxx
RESEND_API_KEY=re_xxxxxxxxx
JOAN_EMAIL=your-real-email@example.com
RESEND_FROM=Joan Cruzat <onboarding@resend.dev>
```

Production with a verified domain:

```text
RESEND_FROM=Joan Cruzat <hello@yourdomain.com>
```

Never put `RESEND_API_KEY` in Angular source code.

## 5. Deploy with GitHub + Vercel

1. Create a GitHub repository.
2. Push this project.
3. Go to Vercel.
4. Import the GitHub repository.
5. Vercel detects the Angular project.
6. Confirm the build command is `npm run build`.
7. Confirm output directory is `dist/joan-cruzat-portfolio/browser`.
8. Add the three environment variables.
9. Deploy.

Vercel deploys each file in `api/` (except `api/_lib/`) as a Node.js function: `GET /api/content`, `POST /api/chat` and `POST /api/contact`. Errors are returned as RFC 9457 problem details (`application/problem+json`) with a visitor-safe `detail`.

## 6. Contact form flow

Visitor -> "Get in touch" dialog -> `POST /api/contact` -> Vercel Function -> Resend -> Joan's email.

The visitor's email is sent as `Reply-To`, so Joan can reply directly from the received inquiry.

The function also:
- validates required fields
- validates email format
- limits request size
- escapes HTML
- keeps the Resend API key server-side
- includes a basic honeypot anti-bot check
- prevents unsupported HTTP methods

For a high-traffic public form, add a stronger rate-limiting/WAF strategy.

## 7. Replace placeholders

Contact details and links are in `src/app/content/site.ts` (and the `profile` row of `db/seed.sql` for the chat). Page metadata and Open Graph tags are in `src/index.html`.

## 8. Free hosting

Vercel supports deploying Angular applications on its platform, including a free deployment path. Resend currently lists a $0 free tier with 3,000 emails/month and 100 emails/day.

Your actual availability and limits are controlled by the providers' current plans and terms.
