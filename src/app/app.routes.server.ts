import { RenderMode, ServerRoute } from '@angular/ssr';

// The site is a single page, prerendered to static HTML at build time.
export const serverRoutes: ServerRoute[] = [{ path: '**', renderMode: RenderMode.Prerender }];
