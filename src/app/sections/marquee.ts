import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-marquee',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // The track is rendered twice so translateX(-50%) loops seamlessly.
  template: `
    <div class="track">
      @for (copy of copies; track copy) {
        @for (item of items(); track item) {
          <span>{{ item }}</span><i>✦</i>
        }
      }
    </div>
  `,
  host: { 'aria-hidden': 'true' },
  styles: `
    :host {
      display: block;
      overflow: hidden;
      padding: 22px 0;
      border-top: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
      white-space: nowrap;
      mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
      -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
    }
    .track {
      display: inline-flex;
      gap: 56px;
      padding-right: 56px;
      animation: marquee 40s linear infinite;
    }
    span { font-size: 15px; color: var(--muted); letter-spacing: .02em; }
    i { font-style: normal; color: var(--accent); }
  `
})
export class Marquee {
  readonly items = input.required<readonly string[]>();
  protected readonly copies = [0, 1] as const;
}
