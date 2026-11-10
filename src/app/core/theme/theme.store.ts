import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Meta } from '@angular/platform-browser';

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';
const THEME_ATTRIBUTE = 'data-theme';
/** Browser chrome colour per theme; matches --bg in _tokens.scss. */
const THEME_COLOR: Readonly<Record<Theme, string>> = { light: '#F8FAFC', dark: '#0B1220' };

/**
 * The light / dark choice. Light is the default; a saved choice is applied before first paint
 * by the inline script in index.html, and this store picks it up from <html data-theme>.
 */
@Injectable({ providedIn: 'root' })
export class ThemeStore {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly current = signal<Theme>(this.readInitialTheme());

  readonly theme = this.current.asReadonly();
  readonly isDark = computed(() => this.current() === 'dark');

  toggle(): void {
    const next: Theme = this.isDark() ? 'light' : 'dark';
    this.current.set(next);
    this.document.documentElement.setAttribute(THEME_ATTRIBUTE, next);
    this.meta.updateTag({ name: 'theme-color', content: THEME_COLOR[next] });
    this.save(next);
  }

  private readInitialTheme(): Theme {
    const isDark = this.isBrowser && this.document.documentElement.getAttribute(THEME_ATTRIBUTE) === 'dark';
    if (isDark) this.meta.updateTag({ name: 'theme-color', content: THEME_COLOR.dark });
    return isDark ? 'dark' : 'light';
  }

  private save(theme: Theme): void {
    try {
      this.document.defaultView?.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage is blocked (private mode, strict settings). The choice still holds for this visit.
    }
  }
}
