import { DestroyRef, Directive, ElementRef, afterNextRender, computed, inject, input, signal } from '@angular/core';
import { canAnimateOnScroll, observeOnce } from './in-view';

const STAGGER_MS = 80;

/**
 * Fades and lifts the host in the first time it scrolls into view (`appReveal="left"`
 * slides in from the left instead). The hidden state is only applied in the browser
 * once IntersectionObserver is confirmed, so prerendered and no-JS content stays visible.
 */
@Directive({
  selector: '[appReveal]',
  host: {
    '[class.reveal-armed]': 'armed()',
    '[class.is-visible]': 'visible()',
    '[class.reveal-left]': "appReveal() === 'left'",
    '[style.--reveal-delay]': 'delay()'
  }
})
export class RevealDirective {
  readonly appReveal = input<'' | 'up' | 'left'>('');
  /** Position within a list; each step adds an 80 ms stagger. */
  readonly revealIndex = input(0);

  protected readonly armed = signal(false);
  protected readonly visible = signal(false);
  protected readonly delay = computed(() => `${this.revealIndex() * STAGGER_MS}ms`);

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (!canAnimateOnScroll()) return;
      this.armed.set(true);
      destroyRef.onDestroy(observeOnce(element, () => this.visible.set(true)));
    });
  }
}
