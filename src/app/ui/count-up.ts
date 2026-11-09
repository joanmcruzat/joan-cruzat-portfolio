import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, input, signal
} from '@angular/core';
import { canAnimateOnScroll, observeOnce } from '../directives/in-view';

const DURATION_MS = 2000;

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/**
 * Shows `to`, counting up from 0 the first time it scrolls into view. Prerendered HTML,
 * no-JS and reduced-motion visitors see the final value straight away.
 */
@Component({
  selector: 'app-count-up',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span aria-hidden="true">{{ value() }}</span><span class="visually-hidden">{{ to() }}</span>`
})
export class CountUp {
  readonly to = input.required<number>();

  /** The animated value; null until the count starts, so the final value renders by default. */
  private readonly current = signal<number | null>(null);
  protected readonly value = computed(() => this.current() ?? this.to());

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    let frame = 0;

    afterNextRender(() => {
      if (!canAnimateOnScroll()) return;
      this.current.set(0);
      const stopObserving = observeOnce(element, () => {
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / DURATION_MS, 1);
          this.current.set(Math.round(easeOutCubic(progress) * this.to()));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      }, 0.4);
      destroyRef.onDestroy(() => {
        stopObserving();
        cancelAnimationFrame(frame);
      });
    });
  }
}
