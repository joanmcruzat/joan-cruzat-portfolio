export interface Principle {
  readonly title: string;
  readonly description: string;
}

export const PRINCIPLES: readonly Principle[] = [
  { title: 'Performance', description: 'Query plans, indexing, caching and payload size. A 200 response is the start, not the goal.' },
  { title: 'Maintainability', description: 'Clear abstractions and code another engineer can follow six months later.' },
  { title: 'Security', description: 'Authentication, validation, careful handling of sensitive data, and logs that actually help.' },
  { title: 'Reliability', description: 'Failure scenarios, retries where they make sense, and observability from day one.' },
  { title: 'Scalability', description: 'Planning for data growth, traffic, async work and sensible service boundaries.' },
  { title: 'Developer experience', description: 'Docs, tests and CI/CD that let a team ship with confidence.' }
];

export interface ArchitectureNode {
  readonly label: string;
  readonly layer: string;
}

/** The "typical system I build" diagram, top to bottom. */
export const ARCHITECTURE = {
  label: 'A typical system I build',
  ariaLabel:
    'Typical system architecture: Angular frontend, .NET Web API, business layer, data access, then databases, cache and third-party APIs on AWS',
  nodes: [
    { label: 'Angular frontend', layer: 'UI' },
    { label: '.NET Web API', layer: 'REST' },
    { label: 'Application / business layer', layer: 'DOMAIN' },
    { label: 'Data access layer', layer: 'EF · SQL' }
  ] satisfies readonly ArchitectureNode[],
  leaves: [
    ['SQL Server', 'MySQL · Postgres'],
    ['Redis', 'cache'],
    ['Third-party', 'APIs']
  ] as const,
  cloud: 'AWS · cloud infrastructure',
  qualities: ['Secure', 'Scalable', 'Observable', 'Testable']
} as const;
