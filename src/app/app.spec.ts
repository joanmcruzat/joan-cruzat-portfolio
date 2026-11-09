import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, DeferBlockState, TestBed } from '@angular/core/testing';
import { CONTENT_FIXTURE } from '../testing/portfolio-content.fixture';
import { App } from './app';
import { CONTENT_URL } from './content/portfolio-content.store';
import { NAV_ITEMS } from './layout/nav';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let el: HTMLElement;
  let http: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()]
    });
    await TestBed.compileComponents(); // resolves the @defer dependencies
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(App);
    // Not whenStable(): the pending /api/content request keeps the app unstable until a test answers it.
    TestBed.tick();
    el = fixture.nativeElement;
  });

  afterEach(() => http.verify());

  async function respond(body: object | null, status = 200): Promise<void> {
    const request = http.expectOne(CONTENT_URL);
    if (status === 200) request.flush(body);
    else request.flush(null, { status, statusText: 'Service Unavailable' });
    await fixture.whenStable();
  }

  describe('while content loads', () => {
    it('shows a polite loading status instead of the sections', () => {
      expect(el.querySelector('[role="status"]')?.textContent).toContain('Loading portfolio');
      expect(el.querySelector('section#work')).toBeNull();
      http.expectOne(CONTENT_URL);
    });
  });

  describe('when the API fails', () => {
    it('shows an alert and retries on request', async () => {
      await respond(null, 503);

      expect(el.querySelector('[role="alert"]')?.textContent).toContain('Content unavailable');

      (el.querySelector('[role="alert"] button') as HTMLButtonElement).click();
      TestBed.tick();
      await respond(CONTENT_FIXTURE);

      expect(el.querySelector('section#work')).not.toBeNull();
    });
  });

  describe('with content', () => {
    beforeEach(() => respond(CONTENT_FIXTURE));

    it('has a single h1 with the hero headline from the API', () => {
      const headings = el.querySelectorAll('h1');

      expect(headings).toHaveLength(1);
      expect(headings[0]?.textContent).toContain('Software that');
      expect(headings[0]?.textContent).toContain('minimum.');
    });

    it('renders every section the nav links to', () => {
      for (const item of NAV_ITEMS) {
        expect(el.querySelector(`section#${item.id}`), item.id).not.toBeNull();
      }
    });

    it('renders projects, principles, experience and stack from the API', () => {
      const text = el.textContent ?? '';
      const { projects, principles, experience, stack } = CONTENT_FIXTURE;

      for (const project of projects) expect(text).toContain(project.title);
      for (const principle of principles) expect(text).toContain(principle.title);
      for (const job of experience) expect(text).toContain(job.role);
      for (const group of stack) expect(text).toContain(group.title);
    });

    it('shows the name in the nav and footer', () => {
      expect(el.querySelector('app-nav .brand')?.textContent).toContain('Ada Lovelace');
      expect(el.querySelector('app-footer')?.textContent).toContain('Ada Lovelace');
    });

    it('links the contact email with mailto', () => {
      expect(el.querySelector('#contact a.mail')?.getAttribute('href')).toBe('mailto:ada@example.com');
    });

    it('opens the GitHub, LinkedIn and résumé links in a new tab without opener access', () => {
      const { githubUrl, linkedinUrl, resumeUrl } = CONTENT_FIXTURE.profile;

      for (const section of ['app-hero', 'app-contact']) {
        const links = Array.from(el.querySelectorAll<HTMLAnchorElement>(`${section} .link-row a`));

        expect(links.map((a) => a.getAttribute('href')), section).toEqual([githubUrl, linkedinUrl, resumeUrl]);
        for (const link of links) {
          expect(link.getAttribute('target'), link.href).toBe('_blank');
          expect(link.getAttribute('rel'), link.href).toBe('noopener noreferrer');
        }
      }
    });

    it('hides the decorative marquee from assistive technology', () => {
      expect(el.querySelector('app-marquee')?.getAttribute('aria-hidden')).toBe('true');
    });

    it('opens the contact dialog from the nav button', async () => {
      (el.querySelector('app-nav .cta') as HTMLButtonElement).click();
      await fixture.whenStable();
      for (const block of await fixture.getDeferBlocks()) await block.render(DeferBlockState.Complete);

      expect(el.querySelector('[role="dialog"][aria-modal="true"]')).not.toBeNull();
    });
  });
});
