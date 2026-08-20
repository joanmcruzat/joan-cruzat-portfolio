# Joan Cruzat Portfolio — Vercel + Resend

A production-ready Angular portfolio with a Vercel serverless contact endpoint backed by Resend.

## 1. Local development

```bash
npm install
npm start
```

The site runs at `http://localhost:4200`.

The Hire Me form needs the environment variables below and a deployed/serverless-compatible endpoint to actually send mail. For local testing, use `vercel dev` after installing the Vercel CLI.

```bash
npm i -g vercel
vercel dev
```

## 2. Create your Resend account

Resend currently has a free transactional tier of 3,000 emails/month and 100 emails/day. See the current pricing before relying on the limits.

Create an API key in Resend and keep it server-side.

For the simplest first deployment, you can use `onboarding@resend.dev` as the sender while testing. For a real portfolio, verify a domain in Resend and use an address on that domain.

## 3. Vercel environment variables

In Vercel:
Project -> Settings -> Environment Variables

Add:

```text
RESEND_API_KEY=re_xxxxxxxxx
JOAN_EMAIL=your-real-email@example.com
RESEND_FROM=Joan Cruzat <onboarding@resend.dev>
```

Production with a verified domain:

```text
RESEND_FROM=Joan Cruzat <hello@yourdomain.com>
```

Never put `RESEND_API_KEY` in Angular source code.

## 4. Deploy with GitHub + Vercel

1. Create a GitHub repository.
2. Push this project.
3. Go to Vercel.
4. Import the GitHub repository.
5. Vercel detects the Angular project.
6. Confirm the build command is `npm run build`.
7. Confirm output directory is `dist/joan-cruzat-portfolio/browser`.
8. Add the three environment variables.
9. Deploy.

The included `vercel.json` also configures the Vercel Node.js function at:

```text
POST /api/contact
```

## 5. Hire Me flow

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

## 6. Replace placeholders

Before launch, replace:
- `YOUR_EMAIL@example.com`
- GitHub URL
- LinkedIn URL
- resume PDF
- any placeholder contact details

## 7. Free hosting

Vercel supports deploying Angular applications on its platform, including a free deployment path. Resend currently lists a $0 free tier with 3,000 emails/month and 100 emails/day.

Your actual availability and limits are controlled by the providers' current plans and terms.


## Motion

The portfolio uses Motion for JavaScript for restrained entrance, viewport, stagger and micro-interaction animations. Motion is installed as a normal npm dependency; run `npm install` after pulling the project. The animation layer does not modify contact, GitHub, LinkedIn, email, Resend, or deployment configuration.
