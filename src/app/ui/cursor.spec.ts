import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Cursor } from './cursor';

function pointer(type: string, target: EventTarget, init: MouseEventInit = {}, pointerType = 'mouse'): void {
  const event = new MouseEvent(type, { bubbles: true, ...init });
  Object.defineProperty(event, 'pointerType', { value: pointerType });
  target.dispatchEvent(event);
}

let frameQueue: FrameRequestCallback[] = [];

function flushFrames(limit = 200): void {
  for (let i = 0; i < limit && frameQueue.length; i++) frameQueue.shift()!(0);
}

function stubMedia(options: { finePointer: boolean; reducedMotion?: boolean }): void {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('pointer: fine') ? options.finePointer : !!options.reducedMotion && query.includes('reduce')
  }));
  // Queue animation frames so tests can flush them on demand (Angular's scheduler uses rAF too).
  frameQueue = [];
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frameQueue.push(callback));
  vi.stubGlobal('cancelAnimationFrame', () => undefined);
}

async function render() {
  const fixture = TestBed.createComponent(Cursor);
  await fixture.whenStable();
  return { fixture, host: fixture.nativeElement as HTMLElement };
}

describe('Cursor', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [Cursor] }));

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  it('stays off on touch-only devices', async () => {
    stubMedia({ finePointer: false });
    const { host } = await render();

    expect(host.classList).not.toContain('is-active');
    expect(document.documentElement.classList).not.toContain('has-custom-cursor');
  });

  it('activates on fine pointers and removes the global class on destroy', async () => {
    stubMedia({ finePointer: true });
    const { fixture, host } = await render();

    expect(host.classList).toContain('is-active');
    expect(host.getAttribute('aria-hidden')).toBe('true');
    expect(document.documentElement.classList).toContain('has-custom-cursor');

    fixture.destroy();
    expect(document.documentElement.classList).not.toContain('has-custom-cursor');
  });

  it('moves the dot to the pointer and the frame catches up', async () => {
    stubMedia({ finePointer: true });
    const { fixture, host } = await render();

    pointer('pointermove', document, { clientX: 10, clientY: 10 });
    pointer('pointermove', document, { clientX: 120, clientY: 80 });
    flushFrames();
    await fixture.whenStable();

    expect(host.classList).toContain('is-visible');
    expect(host.querySelector<HTMLElement>('.dot')!.style.translate).toBe('120px 80px');
    const [x, y] = host.querySelector<HTMLElement>('.frame')!.style.translate.split(' ').map(parseFloat);
    expect(x).toBeCloseTo(120, 0);
    expect(y).toBeCloseTo(80, 0);
  });

  it('ignores touch pointers', async () => {
    stubMedia({ finePointer: true });
    const { fixture, host } = await render();

    pointer('pointermove', document, { clientX: 10, clientY: 10 }, 'touch');
    await fixture.whenStable();

    expect(host.classList).not.toContain('is-visible');
  });

  it('locks on to links, hides over text fields and shrinks while pressed', async () => {
    stubMedia({ finePointer: true });
    const { fixture, host } = await render();
    document.body.innerHTML = '<a href="#"><span id="inner">Link</span></a><input id="field" />';

    pointer('pointerover', document.getElementById('inner')!);
    pointer('pointerdown', document);
    await fixture.whenStable();
    expect(host.classList).toContain('is-hovering');
    expect(host.classList).toContain('is-pressed');

    pointer('pointerup', document);
    pointer('pointerover', document.getElementById('field')!);
    await fixture.whenStable();
    expect(host.classList).not.toContain('is-hovering');
    expect(host.classList).not.toContain('is-pressed');
    expect(host.classList).toContain('is-over-text');
  });

  it('hides when the pointer leaves the window', async () => {
    stubMedia({ finePointer: true });
    const { fixture, host } = await render();

    pointer('pointermove', document, { clientX: 5, clientY: 5 });
    pointer('pointerout', document.body, { relatedTarget: null });
    await fixture.whenStable();

    expect(host.classList).not.toContain('is-visible');
  });
});
