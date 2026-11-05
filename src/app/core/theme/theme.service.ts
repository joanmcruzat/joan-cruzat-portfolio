import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export const THEME_STORAGE_KEY = 'portfolio-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly dark = signal(this.readSavedTheme() !== 'light');

  readonly isDark = this.dark.asReadonly();

  constructor() {
    this.applyTheme();
  }

  toggle(): void {
    this.dark.update((isDark) => !isDark);
    this.applyTheme();
    try {
      localStorage.setItem(THEME_STORAGE_KEY, this.dark() ? 'dark' : 'light');
    } catch {
      // Storage can be blocked (private mode); the theme still applies for this visit.
    }
  }

  private applyTheme(): void {
    this.document.documentElement.classList.toggle('light', !this.dark());
  }

  private readSavedTheme(): string | null {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      return null;
    }
  }
}
