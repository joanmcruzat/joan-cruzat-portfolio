import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Profile } from '../content/portfolio-content.model';

@Component({
  selector: 'app-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer>
      <div><strong>{{ profile().fullName }}</strong><span>{{ profile().footerTagline }}</span></div>
      <div>{{ profile().valuesSummary }}</div>
      <small>© {{ year }} {{ profile().fullName }}. All rights reserved.</small>
    </footer>
  `
})
export class SiteFooter {
  readonly profile = input.required<Profile>();
  protected readonly year = new Date().getFullYear();
}
