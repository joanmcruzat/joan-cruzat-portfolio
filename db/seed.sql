-- Portfolio content. Edit this file and run `npm run db:seed` to replace what the site shows.
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
  'Available for selected remote opportunities',
  'I build scalable systems, APIs, and experiences that',
  'solve real business problems.',
  'Senior Full Stack Engineer specializing in .NET, Angular, REST APIs, databases, integrations, and modern web applications.',
  '8+',
  array['.NET', 'Angular', 'APIs', 'Databases'],
  array['reliable', 'scalable', 'maintainable'],
  array['Engineering with purpose', 'Full stack', 'API integrations', 'Fintech', 'Cloud', 'Performance'],
  'More than shipping code.',
  array[
    'I build reliable software by combining clean architecture, practical engineering, and a strong understanding of business requirements.',
    'My experience spans frontend, backend, databases, integrations, testing, deployment and production troubleshooting. That lets me look at a feature as a complete system—not just a ticket to implement.'
  ],
  'The goal isn''t simply to make software work. It''s to make it reliable, understandable, secure, and ready for the next change.',
  '.NET · Angular · APIs · Cloud · Databases',
  'Have a challenging system to build?',
  'Let''s talk about how I can help build, modernize, integrate, or scale it.',
  'Senior Full Stack Engineer',
  'joanmcruzat@gmail.com',
  'https://github.com/joanmcruzat',
  'https://linkedin.com/in/joan-cruzat',
  '/assets/resume.pdf',
  'Joan Cruzat | Senior Full Stack Engineer',
  'Joan Cruzat — Senior Full Stack Engineer specializing in .NET, Angular, APIs, databases, integrations and cloud.',
  'Building scalable systems, APIs and experiences that solve real business problems.'
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
  (1, '2022 — 2026', 'Senior / .NET Full Stack Engineer', 'Xentra Solutions',
   'Built enterprise-grade .NET applications and REST APIs, optimized SQL queries and stored procedures, designed database structures, delivered financial integrations and microservices, and worked across AWS, Linux, CI/CD, logging and deployment.',
   array['.NET Core', 'Angular', 'MySQL', 'AWS', 'Microservices']),
  (2, '2020 — 2026', 'Angular Frontend Developer', null,
   'Built complex Angular applications and operator dashboards with reporting, graphs, reusable components, forms, settings and REST API integration using TypeScript, RxJS, Angular Material and Tailwind CSS.',
   array['Angular', 'TypeScript', 'RxJS', 'Jasmine']),
  (3, '2016 — 2020', 'PHP Full Stack Developer', null,
   'Developed database-driven academic information management systems and full-stack applications using PHP, JavaScript, HTML, CSS and relational databases.',
   array['PHP', 'JavaScript', 'SQL']);

insert into project (sort_order, title, tag, description, tech) values
  (1, 'Moolah Play / MarkerTrax', 'Operator Platform',
   'Angular operator dashboard with reporting, graphs, user management, settings and REST API integration.',
   array['Angular', 'TypeScript', 'REST APIs', 'Data Visualization']),
  (2, 'Uniteller Remittance Integration', 'Fintech',
   'Third-party financial integration involving signup, KYC, MFA, Plaid and backend service workflows.',
   array['.NET', 'REST APIs', 'Plaid', 'KYC', 'MFA']),
  (3, 'NMI Payment Gateway', 'Payments',
   'Payment gateway integration covering card management, vault concepts, transaction processing and database design.',
   array['.NET', 'Payment APIs', 'SQL', 'Security']),
  (4, 'Usio GPR / Akimbo', 'Financial Services',
   'Card integration with SSO, token handling and coordinated frontend/backend architecture.',
   array['.NET', 'Angular', 'SSO', 'API Integration']),
  (5, 'Bloxcross Crypto Integration', 'API Security',
   'Secure service integration using HMAC authentication, JWT, API logging, validation and error handling.',
   array['.NET 8', 'HMAC', 'JWT', 'Microservices']),
  (6, 'Academic Information Management', 'Education',
   'Database-driven academic information systems built through full-stack PHP development.',
   array['PHP', 'JavaScript', 'HTML', 'SQL']);

insert into skill (sort_order, name) values
  (1, '.NET'), (2, 'C#'), (3, 'Angular'), (4, 'TypeScript'), (5, 'REST APIs'), (6, 'SQL Server'),
  (7, 'MySQL'), (8, 'PostgreSQL'), (9, 'EF Core'), (10, 'Microservices'), (11, 'AWS'), (12, 'Redis'),
  (13, 'CI/CD'), (14, 'Playwright');

insert into principle (sort_order, title, description) values
  (1, 'Performance', 'Query plans, indexing, caching, payload size and scalability—not just whether an endpoint returns 200.'),
  (2, 'Maintainability', 'Clear abstractions, reusable components and code that another engineer can understand six months later.'),
  (3, 'Security', 'Authentication, authorization, validation, sensitive data handling, secure integrations and useful logging.'),
  (4, 'Reliability', 'Validation, failure scenarios, error handling, retries where appropriate, observability and operational thinking.'),
  (5, 'Scalability', 'Database growth, API traffic, caching, asynchronous processing and sensible service boundaries.'),
  (6, 'Developer Experience', 'Documentation, testing, automation and CI/CD that help teams deliver confidently.');

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
