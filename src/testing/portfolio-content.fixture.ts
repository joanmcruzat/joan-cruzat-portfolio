import { PortfolioContent } from '../app/content/portfolio-content.model';

/** A small but complete /api/content response for component tests. */
export const CONTENT_FIXTURE: PortfolioContent = {
  profile: {
    fullName: 'Ada Lovelace',
    headline: 'Engineer',
    availability: 'Open to remote roles',
    yearsExperience: '8+',
    summary: 'Builds reliable systems.',
    hero: {
      lines: ['Software that', 'works is the'],
      accentLine: 'minimum.',
      lead: 'Secure and understandable.',
      intro: 'I am Ada.',
      portraitAlt: 'Ada smiling',
      chips: {
        years: { value: '8+', label: 'years in\nproduction' },
        stack: '.NET · Angular',
        volume: { value: '5k+', label: 'transactions\nprocessed' }
      }
    },
    marquee: ['Payments', 'APIs'],
    email: 'ada@example.com',
    githubUrl: 'https://github.com/ada',
    linkedinUrl: 'https://linkedin.com/in/ada',
    resumeUrl: '/assets/resume.pdf'
  },
  sections: {
    work: { eyebrow: '01 — Work', before: 'Systems that move ', accent: 'money', after: '.', body: null },
    approach: { eyebrow: '02 — Approach', before: 'Whole ', accent: 'systems', after: '.', body: null },
    experience: { eyebrow: '03 — Experience', before: '', accent: '', after: '', body: 'years shipping.' },
    contact: { eyebrow: '04 — Contact', before: 'Have a system that\nneeds to ', accent: 'just work?', after: '', body: 'Say hello.' }
  },
  projects: [
    {
      id: 1, category: 'Payments', title: 'Gateway', description: 'Card payments.', tags: ['.NET'],
      result: { kind: 'metric', value: '5k+', label: 'transactions' }, caseStudyUrl: null
    },
    {
      id: 2, category: 'Education', title: 'Academic Portal', description: 'Records.', tags: ['PHP'],
      result: { kind: 'note', text: 'Where it started' }, caseStudyUrl: null
    }
  ],
  experience: [
    { id: 1, period: '2022 — Now', role: 'Senior Engineer', company: 'Acme', description: 'APIs.' }
  ],
  principles: [
    { id: 1, title: 'Performance', description: 'Fast.' },
    { id: 2, title: 'Security', description: 'Safe.' }
  ],
  stack: [{ id: 1, title: 'Backend', lines: ['.NET · C#', 'REST APIs'] }]
};
