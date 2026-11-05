import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Profile } from './portfolio-content.model';

// Applies the profile's metadata to the document. index.html keeps static defaults
// for crawlers that do not run JavaScript.
@Injectable({ providedIn: 'root' })
export class PageMetaService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  apply(profile: Profile): void {
    this.title.setTitle(profile.metaTitle);
    this.meta.updateTag({ name: 'description', content: profile.metaDescription });
    this.meta.updateTag({ property: 'og:title', content: profile.metaTitle });
    this.meta.updateTag({ property: 'og:description', content: profile.ogDescription });
  }
}
