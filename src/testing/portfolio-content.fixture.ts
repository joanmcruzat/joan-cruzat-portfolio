import { PortfolioContent, Profile } from '../app/core/content/portfolio-content.model';

export function buildProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    fullName: 'Ada Lovelace',
    headline: 'Senior Full Stack Engineer',
    availability: 'Available for remote work',
    heroTitle: 'I build systems that',
    heroHighlight: 'solve problems.',
    summary: 'Engineer focused on APIs.',
    yearsExperience: '8+',
    focus: ['.NET', 'Angular', 'APIs'],
    mindset: ['reliable', 'scalable'],
    ticker: ['Full stack', 'Cloud'],
    aboutHeading: 'More than code.',
    aboutParagraphs: ['First paragraph.', 'Second paragraph.'],
    aboutQuote: 'Make it reliable.',
    valuesSummary: '.NET · Angular',
    contactHeading: 'Have a system to build?',
    contactText: "Let's talk.",
    footerTagline: 'Senior Full Stack Engineer',
    email: 'ada@example.com',
    githubUrl: 'https://github.com/ada',
    linkedinUrl: 'https://www.linkedin.com/in/ada',
    resumeUrl: '/assets/resume.pdf',
    metaTitle: 'Ada Lovelace | Engineer',
    metaDescription: 'Ada builds systems.',
    ogDescription: 'Systems by Ada.',
    ...overrides
  };
}

export function buildContent(overrides: Partial<PortfolioContent> = {}): PortfolioContent {
  return {
    profile: buildProfile(),
    experience: [{ period: '2022 — 2026', role: 'Engineer', company: 'Acme', description: 'Built APIs.', tech: ['.NET'] }],
    projects: [{ title: 'Payments', tag: 'Fintech', description: 'Payment gateway.', tech: ['.NET', 'SQL'] }],
    skills: ['.NET', 'Angular'],
    principles: [{ title: 'Performance', description: 'Fast queries.' }],
    tools: [{ name: '.NET', description: 'Backend', iconUrl: 'https://example.com/net.svg', iconAlt: '.NET' }],
    qualityAreas: [{ title: 'Testing', description: 'Unit and E2E.' }],
    ...overrides
  };
}
