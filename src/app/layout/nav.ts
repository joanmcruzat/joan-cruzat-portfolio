import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { SITE } from '../content/site';

@Component({
  selector: 'app-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="nav">
      <div class="wrap bar">
        <a class="brand" href="#top"><span class="brand-dot" aria-hidden="true"></span>{{ site.fullName }}</a>
        <nav class="links" aria-label="Main">
          @for (item of site.nav; track item.id) {
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
  protected readonly site = SITE;
}
