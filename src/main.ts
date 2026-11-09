import { isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { inject as injectAnalytics } from '@vercel/analytics';
import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig).catch((error: unknown) => console.error(error));

// Browser entry only (the prerender uses main.server.ts), so this never runs at build time.
// Development mode logs page views to the console instead of sending them.
injectAnalytics({ mode: isDevMode() ? 'development' : 'production' });
