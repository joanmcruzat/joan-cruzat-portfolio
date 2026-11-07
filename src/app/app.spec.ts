import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, DeferBlockState, TestBed } from '@angular/core/testing';
import { App } from './app';
import { EXPERIENCE } from './content/experience';
import { PRINCIPLES } from './content/principles';
import { PROJECTS } from './content/projects';
import { SITE } from './content/site';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let el: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()]
    });
    await TestBed.compileComponents(); // resolves the @defer dependencies
    fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    el = fixture.nativeElement;
  });

  it('has a single h1 with the hero headline', () => {
    const headings = el.querySelectorAll('h1');

    expect(headings).toHaveLength(1);
    expect(headings[0]?.textContent).toContain('Software that');
    expect(headings[0]?.textContent).toContain('minimum.');
  });

  it('renders every section the nav links to', () => {
    for (const item of SITE.nav) {
      expect(el.querySelector(`section#${item.id}`), item.id).not.toBeNull();
    }
  });

  it('renders projects, principles and experience from the content files', () => {
    const text = el.textContent ?? '';

    for (const project of PROJECTS) expect(text).toContain(project.title);
    for (const principle of PRINCIPLES) expect(text).toContain(principle.title);
    for (const job of EXPERIENCE) expect(text).toContain(job.role);
  });

  it('links the contact email with mailto', () => {
    expect(el.querySelector('#contact a.mail')?.getAttribute('href')).toBe(`mailto:${SITE.email}`);
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
