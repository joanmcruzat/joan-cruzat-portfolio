import { Component, PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Analytics, SEND_EVENT } from './analytics';
import { TrackDirective } from './track.directive';

function setup(platform: 'browser' | 'server' = 'browser') {
  const send = vi.fn();
  TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection(),
      { provide: PLATFORM_ID, useValue: platform },
      { provide: SEND_EVENT, useValue: send }
    ]
  });
  return send;
}

describe('Analytics', () => {
  it('sends the event with its properties in the browser', () => {
    const send = setup();

    TestBed.inject(Analytics).track('get_in_touch_opened', { source: 'hero' });

    expect(send).toHaveBeenCalledWith('get_in_touch_opened', { source: 'hero' });
  });

  it('sends nothing while prerendering', () => {
    const send = setup('server');

    TestBed.inject(Analytics).track('chat_opened');

    expect(send).not.toHaveBeenCalled();
  });
});

@Component({
  imports: [TrackDirective],
  template: `<a href="#" appTrack="profile_link_clicked" [trackProps]="{ link: 'github', location: 'hero' }">GitHub</a>`
})
class TrackHost {}

describe('TrackDirective', () => {
  it('sends its event when the host is clicked', async () => {
    const send = setup();
    const fixture = TestBed.createComponent(TrackHost);
    await fixture.whenStable();

    (fixture.nativeElement.querySelector('a') as HTMLAnchorElement).click();

    expect(send).toHaveBeenCalledExactlyOnceWith('profile_link_clicked', { link: 'github', location: 'hero' });
  });
});
