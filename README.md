# Joan Cruzat Portfolio — Angular + Vercel + Supabase

An Angular portfolio whose content (profile, experience, projects, skills, principles, toolbox and page metadata) lives in Supabase Postgres. Vercel functions serve that content, send Hire Me inquiries through Resend, and power the AI chat assistant, which builds its knowledge from the same database rows.

## Architecture

```text
Browser (Angular, zoneless, signals)
  GET  /api/content  -> api/content.js  -> Supabase REST (publishable key, read-only via RLS)
  POST /api/chat     -> api/chat.js     -> same content -> system prompt -> Claude
  POST /api/contact  -> api/contact.js  -> Resend -> Joan's inbox
```

| Path | Responsibility |
|---|---|
| `src/app/core/` | App-wide pieces: content model and store, page metadata, theme, layout (nav, footer), HTTP problem details |
| `src/app/features/portfolio/` | Presentational page sections, fed by signal inputs |
| `src/app/features/hire/` | Hire Me dialog (typed reactive form) and its API client |
| `src/app/features/chat/` | Chat widget and its API client |
| `src/app/shared/motion/` | `appReveal` entrance animation directive (Motion) |
| `src/styles/` | Global design system, one partial per section, loaded in order from `angular.json` |
| `api/_lib/` | Shared function code (not deployed as endpoints): HTTP helpers, content repository, chat prompt, validation, rate limit |
| `db/` | SQL migrations and the content seed |

## 1. Local development

```bash
npm install
npx vercel env pull .env.local
```

Run the site and the `/api` functions together with Vercel's dev server (plain `npm start` serves only Angular, so every `/api/*` call returns 404):

```bash
npx vercel dev
```

`vercel dev` reads only `.env`, so it must contain `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` (copy them from `.env.local`; both are safe to expose because row-level security makes the key read-only), plus the Resend and Anthropic keys. Without the Supabase values, `/api/content` answers 503 and the page shows "The portfolio couldn't load right now."

Tests and checks:

```bash
npm test            # Angular unit tests (Vitest)
npm run test:api    # API unit tests (node:test)
npm run verify      # static security and wiring checks
npm run build
```

## 2. Editing content

All site content is in [`db/seed.sql`](db/seed.sql). Edit it, then apply it:

```bash
npm run db:seed
```

The seed rewrites every content table in one transaction. The site picks up changes within about 5 minutes (CDN and function caches).

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

## 6. Hire Me flow

Visitor -> Angular modal -> `POST /api/contact` -> Vercel Function -> Resend -> Joan's email.

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

Contact details, links and page metadata are in the `profile` row of `db/seed.sql`. Replace `src/assets/resume.pdf` to update the resume.

## 8. Free hosting

Vercel supports deploying Angular applications on its platform, including a free deployment path. Resend currently lists a $0 free tier with 3,000 emails/month and 100 emails/day.

Your actual availability and limits are controlled by the providers' current plans and terms.


## Motion

The portfolio uses Motion for JavaScript for restrained entrance, viewport, stagger and micro-interaction animations. Motion is installed as a normal npm dependency; run `npm install` after pulling the project. The animation layer does not modify contact, GitHub, LinkedIn, email, Resend, or deployment configuration.
