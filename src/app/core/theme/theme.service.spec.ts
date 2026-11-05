import { DOCUMENT } from '@angular/common';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { THEME_STORAGE_KEY, ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  afterEach(() => TestBed.inject(DOCUMENT).documentElement.classList.remove('light'));

  it('defaults to the dark theme', () => {
    const theme = TestBed.inject(ThemeService);

    expect(theme.isDark()).toBe(true);
    expect(TestBed.inject(DOCUMENT).documentElement.classList.contains('light')).toBe(false);
  });

  it('restores a saved light theme', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light');

    const theme = TestBed.inject(ThemeService);

    expect(theme.isDark()).toBe(false);
    expect(TestBed.inject(DOCUMENT).documentElement.classList.contains('light')).toBe(true);
  });

  it('toggles the theme and remembers the choice', () => {
    const theme = TestBed.inject(ThemeService);

    theme.toggle();

    expect(theme.isDark()).toBe(false);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    expect(TestBed.inject(DOCUMENT).documentElement.classList.contains('light')).toBe(true);
  });
});
