import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild
} from '@angular/core';

/** Elements that make the cursor frame expand. */
const INTERACTIVE = 'a, button, [role="button"], label, summary, select';
/** Elements that keep the native text cursor (the custom one hides over them). */
const TEXT_FIELD = 'input, textarea, [contenteditable="true"]';

/** Share of the remaining distance the frame covers each frame; lower = more trailing. */
const FRAME_EASE = 0.22;

/**
 * Minimal techy cursor: a square accent dot that tracks the pointer exactly and a
 * corner-bracket frame that trails it, locking wider onto links and buttons.
 * Only runs on fine pointers (mouse/trackpad); touch devices keep their default.
 */
@Component({
  selector: 'app-cursor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './cursor.scss',
  host: {
    'aria-hidden': 'true',
    '[class.is-active]': 'active()',
    '[class.is-visible]': 'visible()',
    '[class.is-hovering]': 'hovering()',
    '[class.is-pressed]': 'pressed()',
    '[class.is-over-text]': 'overText()'
  },
  template: `
    <span #frame class="frame"><i></i><i></i><i></i><i></i></span>
    <span #dot class="dot"></span>
  `
})
export class Cursor {
  protected readonly active = signal(false);
  protected readonly visible = signal(false);
  protected readonly hovering = signal(false);
  protected readonly pressed = signal(false);
  protected readonly overText = signal(false);

  private readonly dot = viewChild.required<ElementRef<HTMLElement>>('dot');
  private readonly frame = viewChild.required<ElementRef<HTMLElement>>('frame');
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  private target = { x: 0, y: 0 };
  private framePos = { x: 0, y: 0 };
  private rafId = 0;
  private ease = FRAME_EASE;

  constructor() {
    afterNextRender(() => this.start());
  }

  private start(): void {
    const view = this.document.defaultView;
    if (!view?.matchMedia?.('(pointer: fine)').matches) return;
    if (view.matchMedia('(prefers-reduced-motion: reduce)').matches) this.ease = 1;

    const root = this.document.documentElement;
    root.classList.add('has-custom-cursor');
    this.active.set(true);

    const listeners: [string, EventListener][] = [
      ['pointermove', (event) => this.onMove(event as PointerEvent)],
      ['pointerover', (event) => this.onOver(event)],
      ['pointerout', (event) => this.onOut(event as PointerEvent)],
      ['pointerdown', () => this.pressed.set(true)],
      ['pointerup', () => this.pressed.set(false)]
    ];
    for (const [type, handler] of listeners) this.document.addEventListener(type, handler, { passive: true });

    this.destroyRef.onDestroy(() => {
      for (const [type, handler] of listeners) this.document.removeEventListener(type, handler);
      cancelAnimationFrame(this.rafId);
      root.classList.remove('has-custom-cursor');
    });
  }

  private onMove(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    this.target = { x: event.clientX, y: event.clientY };
    if (!this.visible()) {
      this.framePos = { ...this.target };
      this.visible.set(true);
    }
    this.place(this.dot().nativeElement, this.target);
    if (!this.rafId) this.rafId = requestAnimationFrame(() => this.tick());
  }

  private onOver(event: Event): void {
    const element = event.target instanceof Element ? event.target : null;
    const isText = !!element?.closest(TEXT_FIELD);
    this.overText.set(isText);
    this.hovering.set(!isText && !!element?.closest(INTERACTIVE));
  }

  private onOut(event: PointerEvent): void {
    // relatedTarget is null when the pointer leaves the window.
    if (!event.relatedTarget) this.visible.set(false);
  }

  /** Eases the frame toward the pointer; stops once it has caught up. */
  private tick(): void {
    const dx = this.target.x - this.framePos.x;
    const dy = this.target.y - this.framePos.y;
    this.framePos = { x: this.framePos.x + dx * this.ease, y: this.framePos.y + dy * this.ease };
    this.place(this.frame().nativeElement, this.framePos);

    const isSettled = Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1;
    this.rafId = isSettled ? 0 : requestAnimationFrame(() => this.tick());
  }

  private place(element: HTMLElement, point: { x: number; y: number }): void {
    element.style.translate = `${point.x}px ${point.y}px`;
  }
}
