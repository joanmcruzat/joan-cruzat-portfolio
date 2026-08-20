# LOOP.md — Joan Portfolio Verification Loop

## Goal
Keep the portfolio deployable, visually correct, and safe to change.

## Loop
1. Inspect the repository and current failure.
2. Make one focused fix.
3. Run `npm run verify`.
4. Run `npm run build` when dependencies are available.
5. Review the changed behavior manually.
6. Only then propose deployment.

## Verification gates
- Angular workspace files exist.
- Theme toggle persists and restores.
- Dark/light theme selectors are present.
- Hire Me calls `/api/contact`.
- Resend credentials remain server-side.
- Reply-To uses the visitor's email.
- Vercel function is present.
- No unrelated refactors.

## Human gate
Do not push, merge, or deploy changes without human approval.
