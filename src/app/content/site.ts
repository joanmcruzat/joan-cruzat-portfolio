// Site-wide copy and links. Edit here; every section reads from this file.

export interface ExternalLink {
  readonly label: string;
  readonly href: string;
}

export interface NavItem {
  readonly id: string;
  readonly label: string;
}

export interface HeroChip {
  readonly value: string;
  /** Rendered on two lines, split at the line break. */
  readonly label: string;
}

export const SITE = {
  fullName: 'Joan Cruzat',
  email: 'joanmcruzat@gmail.com',
  linkedinUrl: 'https://linkedin.com/in/joan-cruzat',
  availability: 'Open to selected remote roles',
  yearsExperience: 9,

  nav: [
    { id: 'work', label: 'Work' },
    { id: 'approach', label: 'Approach' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' }
  ] satisfies readonly NavItem[],

  links: [
    { label: 'GitHub ↗', href: 'https://github.com/joanmcruzat' },
    { label: 'LinkedIn ↗', href: 'https://linkedin.com/in/joan-cruzat' },
    { label: 'Résumé ↓', href: '/assets/resume.pdf' }
  ] satisfies readonly ExternalLink[],

  hero: {
    lines: ['Software that', 'works is the'],
    accentLine: 'minimum.',
    lead: 'I build software that’s secure, understandable, and ready for the next change.',
    intro:
      'I’m Joan, a senior full-stack engineer with 9+ years in .NET and Angular. ' +
      'I build fintech integrations, payment flows, and the dashboards teams run them from.',
    portraitAlt: 'Joan Cruzat, smiling, in a black blazer',
    chips: {
      years: { value: '9+', label: 'years in\nproduction' },
      stack: '.NET · Angular',
      volume: { value: '10k+', label: 'transactions\nprocessed' }
    }
  },

  marquee: [
    'Fintech integrations', 'Payment gateways', 'KYC · MFA · SSO', 'REST APIs',
    'Operator dashboards', 'SQL performance', 'AWS'
  ],

  work: { eyebrow: '01 — Selected work', before: 'Systems that move ', accent: 'money', after: ' and data.' },
  approach: { eyebrow: '02 — Approach', before: 'I look at a feature as a ', accent: 'whole system', after: ', not a ticket.' },
  experience: {
    eyebrow: '03 — Experience',
    caption: 'years shipping and supporting production systems, from database to UI.'
  },
  contact: {
    eyebrow: '04 — Contact',
    lineOne: 'Have a system that',
    lineTwoBefore: 'needs to ',
    accent: 'just work?',
    text: 'I’m open to selected remote roles and contract work: building, modernizing, integrating or scaling.'
  }
} as const;
