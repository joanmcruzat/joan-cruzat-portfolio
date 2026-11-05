import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { buildContent, buildProfile } from '../testing/portfolio-content.fixture';
import { App } from './app';
import { CONTENT_URL } from './core/content/portfolio-content.store';

describe('App', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()]
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  // whenStable() would wait for the pending content request, so render with tick() first.
  function render() {
    const fixture = TestBed.createComponent(App);
    TestBed.tick();
    return fixture;
  }

  it('shows a loading state until the content arrives', async () => {
    const fixture = render();

    expect(fixture.nativeElement.textContent).toContain('Loading…');
    http.expectOne(CONTENT_URL);
  });

  it('renders the sections from the loaded content', async () => {
    const fixture = render();

    http.expectOne(CONTENT_URL).flush(buildContent({ profile: buildProfile({ heroHighlight: 'ship reliable systems.' }) }));
    await fixture.whenStable();

    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('ship reliable systems.');
    expect(text).toContain('Payment gateway.');
    expect(text).toContain('Fast queries.');
  });

  it('applies the profile metadata to the document', async () => {
    const fixture = render();

    http.expectOne(CONTENT_URL).flush(buildContent());
    await fixture.whenStable();

    expect(TestBed.inject(Title).getTitle()).toBe('Ada Lovelace | Engineer');
    expect(TestBed.inject(Meta).getTag('name="description"')?.content).toBe('Ada builds systems.');
  });

  it('shows an error with a retry button when the content fails to load', async () => {
    const fixture = render();

    http.expectOne(CONTENT_URL).flush(null, { status: 503, statusText: 'Service Unavailable' });
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain("The portfolio couldn't load right now.");

    fixture.nativeElement.querySelector('.app-state button').click();
    TestBed.tick();
    http.expectOne(CONTENT_URL).flush(buildContent());
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Payment gateway.');
  });

  it('opens the Hire Me dialog from the navigation', async () => {
    const fixture = render();
    http.expectOne(CONTENT_URL).flush(buildContent());
    await fixture.whenStable();

    fixture.nativeElement.querySelector('.hire-btn').click();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('[role="dialog"][aria-modal="true"]')).not.toBeNull();
  });
});
