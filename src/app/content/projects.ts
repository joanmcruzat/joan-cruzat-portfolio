/** A headline metric (big number + label) or a short muted note. */
export type ProjectResult =
  | { readonly kind: 'metric'; readonly value: string; readonly label: string }
  | { readonly kind: 'note'; readonly text: string };

export interface Project {
  readonly id: string;
  readonly category: string;
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly result: ProjectResult;
  /** When set, the whole row links to the case study. */
  readonly caseStudyUrl?: string;
}

export const PROJECTS: readonly Project[] = [
  {
    id: 'uniteller',
    category: 'Fintech · Remittance',
    title: 'Uniteller Remittance Integration',
    description:
      'End-to-end onboarding and transfer flow for a third-party remittance provider: signup, KYC, MFA and Plaid bank linking, backed by .NET services.',
    tags: ['.NET', 'REST APIs', 'Plaid', 'KYC', 'MFA'],
    result: { kind: 'metric', value: '10k+', label: 'transactions processed' }
  },
  {
    id: 'moolah-play',
    category: 'Operator platform',
    title: 'Moolah Play / MarkerTrax',
    description:
      'An Angular operator dashboard for reporting, charts, user management and settings, connected to REST APIs.',
    tags: ['Angular', 'TypeScript', 'REST APIs', 'Data viz'],
    result: { kind: 'metric', value: '1k+', label: 'active users' }
  },
  {
    id: 'nmi',
    category: 'Payments',
    title: 'NMI Payment Gateway',
    description:
      'Card payments end to end: tokenized card storage, transaction processing, and a database design built for traceability.',
    tags: ['.NET', 'Payment APIs', 'SQL', 'Security'],
    result: { kind: 'note', text: 'Card vault, charges\nand refunds' }
  },
  {
    id: 'usio',
    category: 'Financial services',
    title: 'Usio GPR / Akimbo',
    description:
      'Prepaid card integration with single sign-on and token handling, coordinating the Angular frontend and .NET backend.',
    tags: ['.NET', 'Angular', 'SSO', 'API integration'],
    result: { kind: 'note', text: 'SSO and token\nlifecycle' }
  },
  {
    id: 'bloxcross',
    category: 'API security',
    title: 'Bloxcross Crypto Integration',
    description:
      'A .NET 8 service integration secured with HMAC request signing and JWT, plus structured logging, validation and clear error handling.',
    tags: ['.NET 8', 'HMAC', 'JWT', 'Microservices'],
    result: { kind: 'note', text: 'Signed, logged,\nvalidated requests' }
  },
  {
    id: 'academic',
    category: 'Education',
    title: 'Academic Information Management',
    description: 'Database-driven systems for student records and academic workflows, built full stack in PHP.',
    tags: ['PHP', 'JavaScript', 'SQL'],
    result: { kind: 'note', text: 'Where it\nstarted' }
  }
];
