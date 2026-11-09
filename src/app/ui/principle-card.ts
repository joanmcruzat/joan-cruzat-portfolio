import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Principle } from '../content/portfolio-content.model';

@Component({
  selector: 'app-principle-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="mono num">{{ number() }}</span>
    <h3>{{ principle().title }}</h3>
    <p>{{ principle().description }}</p>
  `,
  styles: `
    :host { display: block; padding: 28px 26px; background: var(--bg); transition: background-color .4s; }
    :host(:hover) { background: var(--surface); }
    .num { font-size: 12px; color: var(--accent); }
    h3 { margin: 14px 0 8px; font-size: 19px; font-weight: 500; letter-spacing: -.02em; }
    p { margin: 0; font-size: 14.5px; line-height: 1.6; color: var(--muted); }
  `
})
export class PrincipleCard {
  readonly principle = input.required<Principle>();
  readonly index = input.required<number>();

  protected readonly number = computed(() => String(this.index() + 1).padStart(2, '0'));
}
