import { isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { inject as injectAnalytics } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig).catch((error: unknown) => console.error(error));

// Browser entry only (the prerender uses main.server.ts), so these never run at build time.
// In development both log to the console instead of sending data.
injectAnalytics({ mode: isDevMode() ? 'development' : 'production' });
injectSpeedInsights({ framework: 'angular', debug: isDevMode() });
