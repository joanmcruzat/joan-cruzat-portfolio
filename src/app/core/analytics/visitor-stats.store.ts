import { isPlatformBrowser } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { computed, inject, Injectable, PLATFORM_ID } from '@angular/core';

export const VISITORS_URL = '/api/visitors';

export interface VisitorStats {
  readonly visitors: number;
  readonly days: number;
}

/** Loads the public visitor count in the browser. Undefined while loading or if the API is unavailable. */
@Injectable({ providedIn: 'root' })
export class VisitorStatsStore {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly resource = httpResource<VisitorStats>(() => (this.isBrowser ? VISITORS_URL : undefined));

  readonly stats = computed(() => (this.resource.hasValue() ? this.resource.value() : undefined));
}
