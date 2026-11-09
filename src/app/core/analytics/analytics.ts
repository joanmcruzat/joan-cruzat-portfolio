import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';
import { track } from '@vercel/analytics';

/** Every custom event the site sends. Shown under Analytics → Events (Vercel Pro plan and up). */
export type AnalyticsEvent =
  | 'get_in_touch_opened'
  | 'inquiry_sent'
  | 'chat_opened'
  | 'chat_message_sent'
  | 'profile_link_clicked'
  | 'email_clicked'
  | 'project_opened';

export type AnalyticsProps = Readonly<Record<string, string>>;

/** The function that sends an event; swapped out in tests. */
export const SEND_EVENT = new InjectionToken<(name: string, props?: AnalyticsProps) => void>('SEND_EVENT', {
  providedIn: 'root',
  factory: () => (name, props) => track(name, props ? { ...props } : undefined)
});

/** Sends custom Vercel Web Analytics events from the browser; does nothing during prerender. */
@Injectable({ providedIn: 'root' })
export class Analytics {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly send = inject(SEND_EVENT);

  track(event: AnalyticsEvent, props?: AnalyticsProps): void {
    if (this.isBrowser) this.send(event, props);
  }
}
