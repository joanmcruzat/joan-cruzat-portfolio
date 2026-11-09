import { Directive, inject, input } from '@angular/core';
import { Analytics, AnalyticsEvent, AnalyticsProps } from './analytics';

/** Sends an analytics event when the host element is clicked: `<a appTrack="email_clicked">`. */
@Directive({
  selector: '[appTrack]',
  host: { '(click)': 'onClick()' }
})
export class TrackDirective {
  readonly appTrack = input.required<AnalyticsEvent>();
  readonly trackProps = input<AnalyticsProps>();

  private readonly analytics = inject(Analytics);

  protected onClick(): void {
    this.analytics.track(this.appTrack(), this.trackProps());
  }
}
