import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="wrap">
      <div class="foot">
        <span>© {{ year }} {{ fullName() }}</span>
        <span class="mono">Built with Angular</span>
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
  protected readonly year = new Date().getFullYear();
}
