import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Fills the hero area while /api/content loads, or offers a retry when it fails. */
@Component({
  selector: 'app-content-status',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (hasError()) {
      <div class="error" role="alert">
        <p class="eyebrow">Content unavailable</p>
        <p class="message">The portfolio couldn’t load just now. Check your connection and try again.</p>
        <button type="button" class="btn btn-ghost" (click)="retry.emit()">Try again</button>
      </div>
    } @else {
      <div class="skeleton" role="status" aria-live="polite">
        <span class="visually-hidden">Loading portfolio…</span>
        <div class="copy" aria-hidden="true">
          <span class="bar pill"></span>
          <span class="bar h1"></span>
          <span class="bar h1"></span>
          <span class="bar h1 short"></span>
          <span class="bar text"></span>
          <span class="bar text short"></span>
        </div>
        <div class="stage" aria-hidden="true"></div>
      </div>
    }
  `,
  styles: `
    :host { display: block; }
    .skeleton, .error {
      display: grid;
      align-items: center;
      min-height: calc(100vh - var(--nav-height));
      padding: 56px 0 72px;
    }
    .skeleton { grid-template-columns: minmax(0, 1.15fr) minmax(0, .85fr); gap: 48px; }
    .copy { display: grid; gap: 18px; }
    .bar, .stage {
      display: block;
      border-radius: 10px;
      background: linear-gradient(90deg, color-mix(in srgb, var(--text) 6%, transparent) 0%, color-mix(in srgb, var(--text) 12%, transparent) 50%, color-mix(in srgb, var(--text) 6%, transparent) 100%);
      background-size: 200% 100%;
      animation: shimmer 1.6s linear infinite;
    }
    .pill { width: 240px; height: 32px; border-radius: var(--radius-pill); }
    .h1 { width: 88%; height: clamp(48px, 7vw, 92px); }
    .text { width: 70%; height: 18px; }
    .short { width: 45%; }
    .stage { width: 100%; max-width: 480px; height: 480px; margin-left: auto; border-radius: 240px 240px 28px 28px; }
    .error { justify-items: start; align-content: center; gap: 16px; }
    .eyebrow { margin: 0; }
    .message { margin: 0; max-width: 440px; font-size: 18px; line-height: 1.6; color: var(--muted); }
    @keyframes shimmer { to { background-position: -200% 0; } }
    @media (max-width: 960px) {
      .skeleton { grid-template-columns: minmax(0, 1fr); }
      .stage { height: 360px; margin: 0 auto; }
    }
  `
})
export class ContentStatus {
  readonly hasError = input(false);
  readonly retry = output();
}
