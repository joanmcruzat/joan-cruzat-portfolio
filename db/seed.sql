-- All portfolio copy. The page (via GET /api/content) and the AI chat assistant both read
-- these tables, so this file is the one place to edit content. Apply with `npm run db:seed`.
-- The seed is idempotent: it rewrites every content table inside one transaction.

begin;

insert into profile (
  id, full_name, headline, availability, years_experience, summary,
  hero_lines, hero_accent, hero_lead, hero_intro, portrait_alt,
  chip_years_label, chip_stack, chip_volume_value, chip_volume_label, marquee,
  email, github_url, linkedin_url, resume_url, meta_title, meta_description, og_description
) values (
  1,
  'Joan Cruzat',
  'Senior Full Stack Engineer',
  'Open to selected remote roles',
  '9+',
  'Senior full-stack engineer with 9+ years in .NET and Angular, building fintech integrations, payment flows, and the dashboards teams run them from.',
  array['Software that', 'works is the'],
  'minimum.',
  'I build software that’s secure, understandable, and ready for the next change.',
  'I’m Joan, a senior full-stack engineer with 9+ years in .NET and Angular. I build fintech integrations, payment flows, and the dashboards teams run them from.',
  'Joan Cruzat, smiling, in a black blazer',
  E'years in\nproduction',
  '.NET · Angular',
  '10k+',
  E'transactions\nprocessed',
  array['Fintech integrations', 'Payment gateways', 'KYC · MFA · SSO', 'REST APIs', 'Operator dashboards', 'SQL performance', 'AWS'],
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
  years_experience = excluded.years_experience,
  summary = excluded.summary,
  hero_lines = excluded.hero_lines,
  hero_accent = excluded.hero_accent,
  hero_lead = excluded.hero_lead,
  hero_intro = excluded.hero_intro,
  portrait_alt = excluded.portrait_alt,
  chip_years_label = excluded.chip_years_label,
  chip_stack = excluded.chip_stack,
  chip_volume_value = excluded.chip_volume_value,
  chip_volume_label = excluded.chip_volume_label,
  marquee = excluded.marquee,
  email = excluded.email,
  github_url = excluded.github_url,
  linkedin_url = excluded.linkedin_url,
  resume_url = excluded.resume_url,
  meta_title = excluded.meta_title,
  meta_description = excluded.meta_description,
  og_description = excluded.og_description;

truncate experience, project, principle, stack_group, section restart identity;

insert into section (key, eyebrow, heading_before, heading_accent, heading_after, body) values
  ('work', '01 — Selected work', 'Systems that move ', 'money', ' and data.', null),
  ('approach', '02 — Approach', 'I look at a feature as a ', 'whole system', ', not a ticket.', null),
  ('experience', '03 — Experience', '', '', '',
   'years shipping and supporting production systems, from database to UI.'),
  ('contact', '04 — Contact', E'Have a system that\nneeds to ', 'just work?', '',
   'I’m open to selected remote roles and contract work: building, modernizing, integrating or scaling.');

insert into experience (sort_order, period, role, company, description) values
  (1, '2022 — Now', 'Senior .NET Full Stack Engineer', 'Xentra Solutions',
   'Enterprise .NET applications, REST APIs, financial integrations and microservices on AWS. Tuned SQL queries and stored procedures, cutting key query times by up to 90%.'),
  (2, '2020 — Now', 'Angular Frontend Developer', 'Concurrent role',
   'Operator dashboards with reporting and charts, reusable components and complex forms, in TypeScript, RxJS, Angular Material and Tailwind CSS.'),
  (3, '2016 — 2020', 'PHP Full Stack Developer', 'Academic systems',
   'Database-driven academic information systems and full-stack web apps in PHP, JavaScript and SQL.');

-- A project shows either a metric (result_value + result_label) or a short note (result_note).
insert into project (sort_order, category, title, description, tags, result_value, result_label, result_note) values
  (1, 'Fintech · Remittance', 'Uniteller Remittance Integration',
   'End-to-end onboarding and transfer flow for a third-party remittance provider: signup, KYC, MFA and Plaid bank linking, backed by .NET services.',
   array['.NET', 'REST APIs', 'Plaid', 'KYC', 'MFA'], '10k+', 'transactions processed', null),
  (2, 'Operator platform', 'Moolah Play / MarkerTrax',
   'An Angular operator dashboard for reporting, charts, user management and settings, connected to REST APIs.',
   array['Angular', 'TypeScript', 'REST APIs', 'Data viz'], '1k+', 'active users', null),
  (3, 'Payments', 'NMI Payment Gateway',
   'Card payments end to end: tokenized card storage, transaction processing, and a database design built for traceability.',
   array['.NET', 'Payment APIs', 'SQL', 'Security'], null, null, E'Card vault, charges\nand refunds'),
  (4, 'Financial services', 'Usio GPR / Akimbo',
   'Prepaid card integration with single sign-on and token handling, coordinating the Angular frontend and .NET backend.',
   array['.NET', 'Angular', 'SSO', 'API integration'], null, null, E'SSO and token\nlifecycle'),
  (5, 'API security', 'Bloxcross Crypto Integration',
   'A .NET 8 service integration secured with HMAC request signing and JWT, plus structured logging, validation and clear error handling.',
   array['.NET 8', 'HMAC', 'JWT', 'Microservices'], null, null, E'Signed, logged,\nvalidated requests'),
  (6, 'Education', 'Academic Information Management',
   'Database-driven systems for student records and academic workflows, built full stack in PHP.',
   array['PHP', 'JavaScript', 'SQL'], null, null, E'Where it\nstarted');

insert into principle (sort_order, title, description) values
  (1, 'Performance', 'Query plans, indexing, caching and payload size. A 200 response is the start, not the goal.'),
  (2, 'Maintainability', 'Clear abstractions and code another engineer can follow six months later.'),
  (3, 'Security', 'Authentication, validation, careful handling of sensitive data, and logs that actually help.'),
  (4, 'Reliability', 'Failure scenarios, retries where they make sense, and observability from day one.'),
  (5, 'Scalability', 'Planning for data growth, traffic, async work and sensible service boundaries.'),
  (6, 'Developer experience', 'Docs, tests and CI/CD that let a team ship with confidence.');

insert into stack_group (sort_order, title, lines) values
  (1, 'Backend', array['.NET / .NET 8 · C#', 'REST APIs · Microservices']),
  (2, 'Frontend', array['Angular · TypeScript', 'RxJS · Material · Tailwind']),
  (3, 'Data', array['SQL Server · MySQL', 'PostgreSQL · Redis']),
  (4, 'Cloud & DevOps', array['AWS · Docker · Linux', 'CI/CD · Git']),
  (5, 'Quality', array['Jasmine · Playwright · Cypress', 'API and E2E testing']),
  (6, 'AI-assisted', array['Copilot and ChatGPT, with every', 'output reviewed and tested']);

commit;
