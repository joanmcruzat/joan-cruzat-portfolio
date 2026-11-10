import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { THEME_STORAGE_KEY, ThemeStore } from './theme.store';

function setup(platform: 'browser' | 'server' = 'browser') {
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection(), { provide: PLATFORM_ID, useValue: platform }]
  });
  return { store: TestBed.inject(ThemeStore), root: TestBed.inject(DOCUMENT).documentElement };
}

describe('ThemeStore', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('starts in light mode by default', () => {
    const { store } = setup();

    expect(store.theme()).toBe('light');
    expect(store.isDark()).toBe(false);
  });

  it('starts in dark mode when the page was already marked dark', () => {
    document.documentElement.setAttribute('data-theme', 'dark');

    const { store } = setup();

    expect(store.isDark()).toBe(true);
  });

  it('stays light while prerendering', () => {
    document.documentElement.setAttribute('data-theme', 'dark');

    const { store } = setup('server');

    expect(store.theme()).toBe('light');
  });

  it('switches the page to dark and remembers the choice', () => {
    const { store, root } = setup();

    store.toggle();

    expect(store.isDark()).toBe(true);
    expect(root.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(document.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe('#0B1220');
  });

  it('switches back to light on a second toggle', () => {
    const { store, root } = setup();

    store.toggle();
    store.toggle();

    expect(root.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('still switches when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const { store, root } = setup();

    store.toggle();

    expect(root.getAttribute('data-theme')).toBe('dark');
  });
});
