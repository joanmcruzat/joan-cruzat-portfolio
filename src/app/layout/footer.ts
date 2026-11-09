import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { VisitorStats } from '../core/analytics/visitor-stats.store';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
  template: `
    <footer class="wrap">
      <div class="foot">
        <span>© {{ year }} {{ fullName() }}</span>
        <span class="mono">
          Built with Angular
          @if (visitors(); as stats) {
            <span class="visitors">· {{ stats.visitors | number }} {{ stats.visitors === 1 ? 'visitor' : 'visitors' }}, last {{ stats.days }} days</span>
          }
        </span>
        <a class="link-u" href="#top">Back to top ↑</a>
      </div>
    </footer>
  `,
  styles: `
    :host { display: block; padding-bottom: 64px; }
    .foot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      padding-top: 28px;
      border-top: 1px solid var(--line);
      font-size: 13px;
      color: var(--muted);
    }
  `
})
export class Footer {
  readonly fullName = input.required<string>();
  /** Hidden until /api/visitors answers. */
  readonly visitors = input<VisitorStats>();
  protected readonly year = new Date().getFullYear();
}
