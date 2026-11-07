import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FakeIntersectionObserver, installScrollEnvironment } from '../../testing/fake-intersection-observer';
import { RevealDirective } from './reveal.directive';

@Component({
  imports: [RevealDirective],
  template: `<div appReveal [revealIndex]="2">Hello</div><div appReveal="left">Timeline</div>`
})
class Host {}

describe('RevealDirective', () => {
  let restore: (() => void) | undefined;

  afterEach(() => restore?.());

  async function render() {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const [first, second] = Array.from(fixture.nativeElement.querySelectorAll('div')) as HTMLElement[];
    return { fixture, first: first!, second: second! };
  }

  it('leaves content visible when IntersectionObserver is unavailable', async () => {
    const { first } = await render();

    expect(first.classList).not.toContain('reveal-armed');
  });

  it('leaves content visible when the visitor prefers reduced motion', async () => {
    restore = installScrollEnvironment({ reducedMotion: true });
    const { first } = await render();

    expect(first.classList).not.toContain('reveal-armed');
  });

  it('hides the element until it scrolls into view, then reveals it once', async () => {
    restore = installScrollEnvironment();
    const { fixture, first } = await render();
    expect(first.classList).toContain('reveal-armed');
    expect(first.classList).not.toContain('is-visible');

    FakeIntersectionObserver.enterAll();
    await fixture.whenStable();

    expect(first.classList).toContain('is-visible');
    expect(FakeIntersectionObserver.instances.every((o) => o.observed.length === 0)).toBe(true);
  });

  it('staggers by 80 ms per index and supports the left variant', async () => {
    restore = installScrollEnvironment();
    const { first, second } = await render();

    expect(first.style.getPropertyValue('--reveal-delay')).toBe('160ms');
    expect(second.classList).toContain('reveal-left');
  });
});
