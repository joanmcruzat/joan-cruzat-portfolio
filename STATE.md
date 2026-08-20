# Portfolio State

## Current
- Portfolio: Angular standalone application
- Hosting target: Vercel
- Email target: Resend
- Theme: dark + light
- Primary CTA: Hire Me

## Latest verification
Static verification is included as `npm run verify`.

## Known environment limitation
A full Angular build could not be executed in the current sandbox because npm registry access is unavailable and Angular packages are not cached locally. The project was statically checked instead.

## Next human check
Run:
```bash
npm install
npm run verify
npm run build
npm start
```
