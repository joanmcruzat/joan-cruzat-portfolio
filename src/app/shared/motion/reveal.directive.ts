import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { animate, inView } from 'motion';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Restrained entrance animation: fades and lifts the host element in, either right
// away ('enter') or the first time it scrolls into view ('view'). Skipped entirely
// when the visitor prefers reduced motion.
@Directive({ selector: '[appReveal]' })
export class RevealDirective {
  readonly appReveal = input<'enter' | 'view' | ''>('view');
  readonly revealY = input(28);
  readonly revealScale = input(1);
  readonly revealDuration = input(0.7);
  readonly revealDelay = input(0);

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const scale = this.revealScale();
      this.element.style.opacity = '0';
      this.element.style.transform = `translateY(${this.revealY()}px) scale(${scale})`;

      const play = () => {
        animate(
          this.element,
          { opacity: 1, y: [this.revealY(), 0], scale: [scale, 1] },
          { duration: this.revealDuration(), delay: this.revealDelay(), ease: EASE_OUT }
        );
      };

      if (this.appReveal() === 'enter') {
        play();
      } else {
        destroyRef.onDestroy(inView(this.element, play));
      }
    });
  }
}

// Stagger for items in a list: 45 ms per item, capped so long lists don't drag.
export function staggerDelay(index: number): number {
  return Math.min(index * 0.045, 0.22);
}
