import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CONTENT_FIXTURE } from '../../testing/portfolio-content.fixture';
import { Experience } from './experience';

describe('Experience', () => {
  it('counts up to the number in the years value and keeps the rest as a suffix', async () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(Experience);
    fixture.componentRef.setInput('copy', CONTENT_FIXTURE.sections.experience);
    fixture.componentRef.setInput('years', '12+');
    fixture.componentRef.setInput('jobs', CONTENT_FIXTURE.experience);
    fixture.componentRef.setInput('stack', CONTENT_FIXTURE.stack);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('.big-num .visually-hidden')?.textContent).toBe('12');
    expect(el.querySelector('.big-num .serif')?.textContent).toBe('+');
    expect(el.querySelector('.caption')?.textContent).toBe('years shipping.');
  });
});
