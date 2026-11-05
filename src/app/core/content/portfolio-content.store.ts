import { httpResource } from '@angular/common/http';
import { Injectable, computed } from '@angular/core';
import { PortfolioContent } from './portfolio-content.model';

export const CONTENT_URL = '/api/content';

@Injectable({ providedIn: 'root' })
export class PortfolioContentStore {
  private readonly resource = httpResource<PortfolioContent>(() => CONTENT_URL);

  readonly content = computed(() => (this.resource.hasValue() ? this.resource.value() : undefined));
  readonly profile = computed(() => this.content()?.profile);
  readonly isLoading = this.resource.isLoading;
  readonly hasError = computed(() => this.resource.error() !== undefined);

  reload(): void {
    this.resource.reload();
  }
}
