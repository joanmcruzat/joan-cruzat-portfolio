import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, DeferBlockState, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { CONTENT_FIXTURE } from '../testing/portfolio-content.fixture';
import { App } from './app';
import { CONTENT_URL } from './content/portfolio-content.store';
import { SEND_EVENT } from './core/analytics/analytics';
import { VISITORS_URL } from './core/analytics/visitor-stats.store';
import { NAV_ITEMS } from './layout/nav';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let el: HTMLElement;
  let http: HttpTestingController;
  let sendEvent: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    sendEvent = vi.fn();
    TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting(),
        { provide: SEND_EVENT, useValue: sendEvent }
      ]
    });
    await TestBed.compileComponents(); // resolves the @defer dependencies
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(App);
    // Not whenStable(): the pending /api/content request keeps the app unstable until a test answers it.
    TestBed.tick();
    el = fixture.nativeElement;
  });

  afterEach(() => {
    // The visitor count loads independently; answer it if a test left it pending.
    for (const request of http.match(VISITORS_URL)) request.flush(null, { status: 503, statusText: 'Unavailable' });
    http.verify();
  });

  /** Renders pending changes without whenStable(), which would wait on unanswered requests. */
  async function settle(): Promise<void> {
    TestBed.tick();
    await new Promise((resolve) => setTimeout(resolve));
    TestBed.tick();
  }

  async function respond(body: object | null, status = 200): Promise<void> {
    const request = http.expectOne(CONTENT_URL);
    if (status === 200) request.flush(body);
    else request.flush(null, { status, statusText: 'Service Unavailable' });
    await settle();
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

    it('opens the contact dialog from the nav button and records where it came from', async () => {
      (el.querySelector('app-nav .cta') as HTMLButtonElement).click();
      await settle();
      for (const block of await fixture.getDeferBlocks()) await block.render(DeferBlockState.Complete);

      expect(el.querySelector('[role="dialog"][aria-modal="true"]')).not.toBeNull();
      expect(sendEvent).toHaveBeenCalledWith('get_in_touch_opened', { source: 'nav' });
    });

    it('records profile link clicks with the link and its location', () => {
      const github = el.querySelector<HTMLAnchorElement>('#contact .link-row a')!;
      github.addEventListener('click', (event) => event.preventDefault());

      github.click();

      expect(sendEvent).toHaveBeenCalledWith('profile_link_clicked', { link: 'github', location: 'contact' });
    });

    it('shows the live visitor count at the top of the hero once /api/visitors answers', async () => {
      expect(el.querySelector('app-hero .visitors')).toBeNull();

      http.expectOne(VISITORS_URL).flush({ visitors: 1234, days: 30 });
      await settle();

      const line = el.querySelector('app-hero .visitors')?.textContent?.replace(/\s+/g, ' ');
      expect(line).toContain('1234');
      expect(line).toContain('visitors · last 30 days');
    });

    it('uses the singular for one visitor', async () => {
      http.expectOne(VISITORS_URL).flush({ visitors: 1, days: 30 });
      await settle();

      expect(el.querySelector('app-hero .visitors')?.textContent).toMatch(/1\s+visitor · last 30 days/);
    });

    it('leaves the visitor count out when /api/visitors fails', async () => {
      http.expectOne(VISITORS_URL).flush(null, { status: 503, statusText: 'Unavailable' });
      await settle();

      expect(el.querySelector('app-hero .visitors')).toBeNull();
    });
  });
});
