import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { ThemeStore } from '../core/theme/theme.store';

/** In-page anchors; each id matches a section element. Layout, not content, so it lives here. */
export const NAV_ITEMS = [
  { id: 'work', label: 'Work' },
  { id: 'approach', label: 'Approach' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' }
] as const;

@Component({
  selector: 'app-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="nav">
      <div class="wrap bar">
        <a class="brand" href="#top"><span class="brand-dot" aria-hidden="true"></span>{{ fullName() }}</a>
        <nav class="links" aria-label="Main">
          @for (item of items; track item.id) {
            <a [href]="'#' + item.id">{{ item.label }}</a>
          }
        </nav>
        <div class="actions">
          <button type="button" class="theme-toggle" [attr.aria-label]="theme.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
            [attr.aria-pressed]="theme.isDark()" (click)="theme.toggle()">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"
              stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              @if (theme.isDark()) {
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              } @else {
                <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
              }
            </svg>
          </button>
          <button type="button" class="btn btn-primary cta" (click)="getInTouch.emit()">
            Get in touch <span class="arr" aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </header>
  `,
  styleUrl: './nav.scss'
})
export class Nav {
  readonly getInTouch = output();
  /** Empty while content loads; the brand dot still shows. */
  readonly fullName = input('');
  protected readonly items = NAV_ITEMS;
  protected readonly theme = inject(ThemeStore);
}
