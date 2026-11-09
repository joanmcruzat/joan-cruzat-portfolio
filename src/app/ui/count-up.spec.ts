import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { FakeIntersectionObserver, installScrollEnvironment } from '../../testing/fake-intersection-observer';
import { CountUp } from './count-up';

describe('CountUp', () => {
  let restore: (() => void) | undefined;

  afterEach(() => {
    restore?.();
    vi.useRealTimers();
  });

  async function render(): Promise<ComponentFixture<CountUp>> {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(CountUp);
    fixture.componentRef.setInput('to', 9);
    await fixture.whenStable();
    return fixture;
  }

  const shown = (fixture: ComponentFixture<CountUp>) =>
    fixture.nativeElement.querySelector('[aria-hidden="true"]').textContent;

  it('shows the final value without IntersectionObserver', async () => {
    const fixture = await render();

    expect(shown(fixture)).toBe('9');
  });

  it('shows the final value immediately under reduced motion', async () => {
    restore = installScrollEnvironment({ reducedMotion: true });
    const fixture = await render();

    expect(shown(fixture)).toBe('9');
  });

  it('starts at 0 and counts up to the target once in view', async () => {
    restore = installScrollEnvironment();
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
    const fixture = await render();
    expect(shown(fixture)).toBe('0');

    FakeIntersectionObserver.enterAll();
    vi.advanceTimersByTime(2100);
    await fixture.whenStable();

    expect(shown(fixture)).toBe('9');
  });

  it('always exposes the final value to assistive technology', async () => {
    restore = installScrollEnvironment();
    const fixture = await render();

    expect(fixture.nativeElement.querySelector('.visually-hidden').textContent).toBe('9');
  });
});
