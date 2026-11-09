import { vi } from 'vitest';

/** Minimal IntersectionObserver stand-in: call `enter()` to report the observed elements as visible. */
export class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  readonly observed: Element[] = [];

  constructor(private readonly callback: IntersectionObserverCallback) {
    FakeIntersectionObserver.instances.push(this);
  }

  observe(element: Element): void {
    this.observed.push(element);
  }

  disconnect(): void {
    this.observed.length = 0;
  }

  enter(): void {
    const entries = this.observed.map((target) => ({ target, isIntersecting: true }) as IntersectionObserverEntry);
    this.callback(entries, this as unknown as IntersectionObserver);
  }

  static enterAll(): void {
    for (const observer of FakeIntersectionObserver.instances) observer.enter();
  }
}

/** Installs the fake observer and a matchMedia stub; returns a cleanup function. */
export function installScrollEnvironment(options: { reducedMotion?: boolean } = {}): () => void {
  FakeIntersectionObserver.instances = [];
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: !!options.reducedMotion && query.includes('reduce') }));
  return () => vi.unstubAllGlobals();
}
