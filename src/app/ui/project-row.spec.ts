import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Project } from '../content/projects';
import { ProjectRow } from './project-row';

const base: Project = {
  id: 'payments',
  category: 'Payments',
  title: 'Gateway',
  description: 'Card payments.',
  tags: ['.NET', 'SQL'],
  result: { kind: 'metric', value: '10k+', label: 'transactions processed' }
};

describe('ProjectRow', () => {
  async function render(project: Project, index = 0): Promise<HTMLElement> {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(ProjectRow);
    fixture.componentRef.setInput('project', project);
    fixture.componentRef.setInput('index', index);
    await fixture.whenStable();
    return fixture.nativeElement;
  }

  it('renders a zero-padded number, the title and every tag', async () => {
    const el = await render(base, 2);

    expect(el.querySelector('.num')?.textContent).toBe('03');
    expect(el.querySelector('.title')?.textContent).toBe('Gateway');
    expect(Array.from(el.querySelectorAll('.tag')).map((t) => t.textContent)).toEqual(['.NET', 'SQL']);
  });

  it('renders a metric result as a big number with a label', async () => {
    const el = await render(base);

    expect(el.querySelector('.result b')?.textContent).toBe('10k+');
    expect(el.querySelector('.result span')?.textContent).toBe('transactions processed');
  });

  it('renders a note result as muted text', async () => {
    const el = await render({ ...base, result: { kind: 'note', text: 'Where it started' } });

    expect(el.querySelector('.result b')).toBeNull();
    expect(el.querySelector('.soft')?.textContent).toBe('Where it started');
  });

  it('is not a link without a case study', async () => {
    const el = await render(base);

    expect(el.querySelector('a.row')).toBeNull();
    expect(el.querySelector('div.row')).not.toBeNull();
  });

  it('makes the whole row a link when a case study URL is set', async () => {
    const el = await render({ ...base, caseStudyUrl: '/work/payments' });

    expect(el.querySelector('a.row')?.getAttribute('href')).toBe('/work/payments');
  });
});
