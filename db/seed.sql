-- Knowledge base for the AI chat assistant (api/chat.js). The page itself renders from
-- src/app/content/*.ts, so keep the two in sync when copy changes. Apply with `npm run db:seed`.
-- The seed is idempotent: it rewrites every content table inside one transaction.

begin;

insert into profile (
  id, full_name, headline, availability, hero_title, hero_highlight, summary, years_experience,
  focus, mindset, ticker, about_heading, about_paragraphs, about_quote, values_summary,
  contact_heading, contact_text, footer_tagline, email, github_url, linkedin_url, resume_url,
  meta_title, meta_description, og_description
) values (
  1,
  'Joan Cruzat',
  'Senior Full Stack Engineer',
  'Open to selected remote roles',
  'Software that works is the',
  'minimum.',
  'Senior full-stack engineer with 9+ years in .NET and Angular, building fintech integrations, payment flows, and the dashboards teams run them from.',
  '9+',
  array['.NET', 'Angular', 'APIs', 'Databases'],
  array['reliable', 'scalable', 'maintainable'],
  array['Fintech integrations', 'Payment gateways', 'KYC · MFA · SSO', 'REST APIs', 'Operator dashboards', 'SQL performance', 'AWS'],
  'More than shipping code.',
  array[
    'I build reliable software by combining clean architecture, practical engineering, and a strong understanding of business requirements.',
    'My experience spans frontend, backend, databases, integrations, testing, deployment and production troubleshooting. That lets me look at a feature as a complete system—not just a ticket to implement.'
  ],
  'The goal isn''t simply to make software work. It''s to make it reliable, understandable, secure, and ready for the next change.',
  '.NET · Angular · APIs · Cloud · Databases',
  'Have a system that needs to just work?',
  'I''m open to selected remote roles and contract work: building, modernizing, integrating or scaling.',
  'Senior Full Stack Engineer',
  'joanmcruzat@gmail.com',
  'https://github.com/joanmcruzat',
  'https://linkedin.com/in/joan-cruzat',
  '/assets/resume.pdf',
  'Joan Cruzat | Senior Full Stack Engineer',
  'Senior full-stack engineer (.NET, Angular) building secure fintech integrations, payment flows and operator dashboards.',
  'Senior full-stack engineer (.NET, Angular) building secure fintech integrations, payment flows and operator dashboards.'
)
on conflict (id) do update set
  full_name = excluded.full_name,
  headline = excluded.headline,
  availability = excluded.availability,
  hero_title = excluded.hero_title,
  hero_highlight = excluded.hero_highlight,
  summary = excluded.summary,
  years_experience = excluded.years_experience,
  focus = excluded.focus,
  mindset = excluded.mindset,
  ticker = excluded.ticker,
  about_heading = excluded.about_heading,
  about_paragraphs = excluded.about_paragraphs,
  about_quote = excluded.about_quote,
  values_summary = excluded.values_summary,
  contact_heading = excluded.contact_heading,
  contact_text = excluded.contact_text,
  footer_tagline = excluded.footer_tagline,
  email = excluded.email,
  github_url = excluded.github_url,
  linkedin_url = excluded.linkedin_url,
  resume_url = excluded.resume_url,
  meta_title = excluded.meta_title,
  meta_description = excluded.meta_description,
  og_description = excluded.og_description;

truncate experience, project, skill, principle, tool, quality_area restart identity;

insert into experience (sort_order, period, role, company, description, tech) values
  (1, '2022 — Now', 'Senior .NET Full Stack Engineer', 'Xentra Solutions',
   'Enterprise .NET applications, REST APIs, financial integrations and microservices on AWS. Tuned SQL queries and stored procedures, cutting key query times by up to 90%.',
   array['.NET', 'Angular', 'MySQL', 'AWS', 'Microservices']),
  (2, '2020 — Now', 'Angular Frontend Developer', 'Concurrent role',
   'Operator dashboards with reporting and charts, reusable components and complex forms, in TypeScript, RxJS, Angular Material and Tailwind CSS.',
   array['Angular', 'TypeScript', 'RxJS', 'Jasmine']),
  (3, '2016 — 2020', 'PHP Full Stack Developer', 'Academic systems',
   'Database-driven academic information systems and full-stack web apps in PHP, JavaScript and SQL.',
   array['PHP', 'JavaScript', 'SQL']);

insert into project (sort_order, title, tag, description, tech) values
  (1, 'Uniteller Remittance Integration', 'Fintech · Remittance',
   'End-to-end onboarding and transfer flow for a third-party remittance provider: signup, KYC, MFA and Plaid bank linking, backed by .NET services. 10k+ transactions processed.',
   array['.NET', 'REST APIs', 'Plaid', 'KYC', 'MFA']),
  (2, 'Moolah Play / MarkerTrax', 'Operator platform',
   'An Angular operator dashboard for reporting, charts, user management and settings, connected to REST APIs. 1k+ active users.',
   array['Angular', 'TypeScript', 'REST APIs', 'Data viz']),
  (3, 'NMI Payment Gateway', 'Payments',
   'Card payments end to end: tokenized card storage, transaction processing, and a database design built for traceability.',
   array['.NET', 'Payment APIs', 'SQL', 'Security']),
  (4, 'Usio GPR / Akimbo', 'Financial services',
   'Prepaid card integration with single sign-on and token handling, coordinating the Angular frontend and .NET backend.',
   array['.NET', 'Angular', 'SSO', 'API integration']),
  (5, 'Bloxcross Crypto Integration', 'API security',
   'A .NET 8 service integration secured with HMAC request signing and JWT, plus structured logging, validation and clear error handling.',
   array['.NET 8', 'HMAC', 'JWT', 'Microservices']),
  (6, 'Academic Information Management', 'Education',
   'Database-driven systems for student records and academic workflows, built full stack in PHP.',
   array['PHP', 'JavaScript', 'SQL']);

insert into skill (sort_order, name) values
  (1, '.NET'), (2, 'C#'), (3, 'Angular'), (4, 'TypeScript'), (5, 'REST APIs'), (6, 'SQL Server'),
  (7, 'MySQL'), (8, 'PostgreSQL'), (9, 'EF Core'), (10, 'Microservices'), (11, 'AWS'), (12, 'Redis'),
  (13, 'CI/CD'), (14, 'Playwright');

insert into principle (sort_order, title, description) values
  (1, 'Performance', 'Query plans, indexing, caching and payload size. A 200 response is the start, not the goal.'),
  (2, 'Maintainability', 'Clear abstractions and code another engineer can follow six months later.'),
  (3, 'Security', 'Authentication, validation, careful handling of sensitive data, and logs that actually help.'),
  (4, 'Reliability', 'Failure scenarios, retries where they make sense, and observability from day one.'),
  (5, 'Scalability', 'Planning for data growth, traffic, async work and sensible service boundaries.'),
  (6, 'Developer experience', 'Docs, tests and CI/CD that let a team ship with confidence.');

insert into tool (sort_order, name, description, icon_url, icon_alt) values
  (1, '.NET', 'Backend & APIs', 'https://cdn.jsdelivr.net/gh/devicons/devicon@master/icons/dot-net/dot-net-original.svg', '.NET'),
  (2, 'C#', 'Application development', 'https://cdn.jsdelivr.net/gh/devicons/devicon@master/icons/csharp/csharp-original.svg', 'C#'),
  (3, 'Angular', 'Frontend applications', 'https://cdn.jsdelivr.net/gh/devicons/devicon@master/icons/angular/angular-original.svg', 'Angular'),
  (4, 'TypeScript', 'Frontend engineering', 'https://cdn.jsdelivr.net/gh/devicons/devicon@master/icons/typescript/typescript-original.svg', 'TypeScript'),
  (5, 'SQL Server', 'Relational data', 'https://cdn.jsdelivr.net/gh/devicons/devicon@master/icons/microsoftsqlserver/microsoftsqlserver-plain.svg', 'Microsoft SQL Server'),
  (6, 'MySQL', 'Relational data', 'https://cdn.jsdelivr.net/gh/devicons/devicon@master/icons/mysql/mysql-original.svg', 'MySQL'),
  (7, 'PostgreSQL', 'Relational data', 'https://cdn.jsdelivr.net/gh/devicons/devicon@master/icons/postgresql/postgresql-original.svg', 'PostgreSQL'),
  (8, 'AWS', 'Cloud infrastructure', 'https://cdn.jsdelivr.net/gh/devicons/devicon@master/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', 'Amazon Web Services'),
  (9, 'Redis', 'Caching & performance', 'https://cdn.jsdelivr.net/gh/devicons/devicon@master/icons/redis/redis-original.svg', 'Redis'),
  (10, 'Playwright', 'E2E automation', 'https://cdn.jsdelivr.net/gh/devicons/devicon@master/icons/playwright/playwright-original.svg', 'Playwright'),
  (11, 'Git', 'Version control', 'https://cdn.jsdelivr.net/gh/devicons/devicon@master/icons/git/git-original.svg', 'Git'),
  (12, 'Docker', 'Application containers', 'https://cdn.jsdelivr.net/gh/devicons/devicon@master/icons/docker/docker-original.svg', 'Docker');

insert into quality_area (sort_order, title, description) values
  (1, 'Testing & Quality', 'Unit Testing · Jasmine · Playwright · Cypress · API Testing · E2E Testing · CI Testing · TDD Concepts'),
  (2, 'AI-Assisted Development', 'GitHub Copilot · ChatGPT · AI coding assistants. AI-generated output is reviewed, tested, and validated for security, correctness and performance.');

commit;
