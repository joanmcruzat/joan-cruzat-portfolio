import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RevealDirective } from '../../shared/motion/reveal.directive';

@Component({
  selector: 'app-ticker-strip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <div class="ticker">
      @for (item of items(); track item; let i = $index, last = $last) {
        <span appReveal="enter" [revealY]="0" [revealDuration]="0.45" [revealDelay]="0.45 + i * 0.12">{{ item }}</span>
        @if (!last) {
          <span appReveal="enter" [revealY]="0" [revealDuration]="0.45" [revealDelay]="0.51 + i * 0.12">•</span>
        }
      }
    </div>
  `
})
export class TickerStrip {
  readonly items = input.required<readonly string[]>();
}
