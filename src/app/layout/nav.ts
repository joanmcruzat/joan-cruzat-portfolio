import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

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
        <button type="button" class="btn btn-primary cta" (click)="getInTouch.emit()">
          Get in touch <span class="arr" aria-hidden="true">→</span>
        </button>
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
}
