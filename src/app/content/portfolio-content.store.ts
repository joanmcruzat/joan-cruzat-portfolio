import { isPlatformBrowser } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { computed, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { PortfolioContent } from './portfolio-content.model';

export const CONTENT_URL = '/api/content';

/**
 * Loads the page content from /api/content in the browser. The prerendered HTML
 * ships the loading state, because the API is not reachable at build time.
 */
@Injectable({ providedIn: 'root' })
export class PortfolioContentStore {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly resource = httpResource<PortfolioContent>(() => (this.isBrowser ? CONTENT_URL : undefined));

  readonly content = computed(() => (this.resource.hasValue() ? this.resource.value() : undefined));
  readonly profile = computed(() => this.content()?.profile);
  readonly hasError = computed(() => this.resource.error() !== undefined);

  reload(): void {
    this.resource.reload();
  }
}
