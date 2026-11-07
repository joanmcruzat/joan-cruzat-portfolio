export interface Job {
  readonly id: string;
  readonly period: string;
  readonly role: string;
  readonly company: string;
  readonly description: string;
}

export const EXPERIENCE: readonly Job[] = [
  {
    id: 'xentra',
    period: '2022 — Now',
    role: 'Senior .NET Full Stack Engineer',
    company: 'Xentra Solutions',
    description:
      'Enterprise .NET applications, REST APIs, financial integrations and microservices on AWS. Tuned SQL queries and stored procedures, cutting key query times by up to 90%.'
  },
  {
    id: 'angular',
    period: '2020 — Now',
    role: 'Angular Frontend Developer',
    company: 'Concurrent role',
    description:
      'Operator dashboards with reporting and charts, reusable components and complex forms, in TypeScript, RxJS, Angular Material and Tailwind CSS.'
  },
  {
    id: 'php',
    period: '2016 — 2020',
    role: 'PHP Full Stack Developer',
    company: 'Academic systems',
    description: 'Database-driven academic information systems and full-stack web apps in PHP, JavaScript and SQL.'
  }
];
