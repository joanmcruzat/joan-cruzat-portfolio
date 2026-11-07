export interface StackGroup {
  readonly title: string;
  /** Each entry renders on its own line. */
  readonly lines: readonly string[];
}

export const STACK: readonly StackGroup[] = [
  { title: 'Backend', lines: ['.NET / .NET 8 · C#', 'REST APIs · Microservices'] },
  { title: 'Frontend', lines: ['Angular · TypeScript', 'RxJS · Material · Tailwind'] },
  { title: 'Data', lines: ['SQL Server · MySQL', 'PostgreSQL · Redis'] },
  { title: 'Cloud & DevOps', lines: ['AWS · Docker · Linux', 'CI/CD · Git'] },
  { title: 'Quality', lines: ['Jasmine · Playwright · Cypress', 'API and E2E testing'] },
  { title: 'AI-assisted', lines: ['Copilot and ChatGPT, with every', 'output reviewed and tested'] }
];
