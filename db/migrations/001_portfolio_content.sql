-- Portfolio content: everything the site and the chat assistant show about Joan.
-- Tables are read-only for the public (anon) role through row-level security;
-- content is edited by running db/seed.sql (or SQL) with the database owner role.

create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Single row (id is always 1): identity, hero, about, contact and page metadata.
create table profile (
  id                smallint primary key default 1 check (id = 1),
  full_name         varchar(100)  not null,
  headline          varchar(150)  not null,
  availability      varchar(150)  not null,
  hero_title        varchar(200)  not null,
  hero_highlight    varchar(200)  not null,
  summary           varchar(500)  not null,
  years_experience  varchar(10)   not null,
  focus             text[]        not null default '{}',
  mindset           text[]        not null default '{}',
  ticker            text[]        not null default '{}',
  about_heading     varchar(150)  not null,
  about_paragraphs  text[]        not null default '{}',
  about_quote       varchar(500)  not null,
  values_summary    varchar(300)  not null,
  contact_heading   varchar(150)  not null,
  contact_text      varchar(300)  not null,
  footer_tagline    varchar(150)  not null,
  email             varchar(254)  not null,
  github_url        varchar(300)  not null,
  linkedin_url      varchar(300)  not null,
  resume_url        varchar(300)  not null,
  meta_title        varchar(70)   not null,
  meta_description  varchar(170)  not null,
  og_description    varchar(200)  not null,
  created_at        timestamptz   not null default now(),
  updated_at        timestamptz   not null default now()
);

create table experience (
  id           integer generated always as identity primary key,
  sort_order   smallint      not null unique,
  period       varchar(30)   not null,
  role         varchar(150)  not null,
  company      varchar(150),
  description  varchar(1000) not null,
  tech         text[]        not null default '{}',
  created_at   timestamptz   not null default now(),
  updated_at   timestamptz   not null default now()
);

create table project (
  id           integer generated always as identity primary key,
  sort_order   smallint      not null unique,
  title        varchar(150)  not null,
  tag          varchar(60)   not null,
  description  varchar(1000) not null,
  tech         text[]        not null default '{}',
  created_at   timestamptz   not null default now(),
  updated_at   timestamptz   not null default now()
);

create table skill (
  id           integer generated always as identity primary key,
  sort_order   smallint      not null unique,
  name         varchar(60)   not null unique,
  created_at   timestamptz   not null default now(),
  updated_at   timestamptz   not null default now()
);

create table principle (
  id           integer generated always as identity primary key,
  sort_order   smallint      not null unique,
  title        varchar(80)   not null,
  description  varchar(500)  not null,
  created_at   timestamptz   not null default now(),
  updated_at   timestamptz   not null default now()
);

create table tool (
  id           integer generated always as identity primary key,
  sort_order   smallint      not null unique,
  name         varchar(60)   not null unique,
  description  varchar(100)  not null,
  icon_url     varchar(300)  not null,
  icon_alt     varchar(100)  not null,
  created_at   timestamptz   not null default now(),
  updated_at   timestamptz   not null default now()
);

create table quality_area (
  id           integer generated always as identity primary key,
  sort_order   smallint      not null unique,
  title        varchar(80)   not null,
  description  varchar(500)  not null,
  created_at   timestamptz   not null default now(),
  updated_at   timestamptz   not null default now()
);

do $$
declare
  t text;
begin
  foreach t in array array['profile', 'experience', 'project', 'skill', 'principle', 'tool', 'quality_area'] loop
    execute format('create trigger %I before update on %I for each row execute function set_updated_at()', t || '_set_updated_at', t);
    execute format('alter table %I enable row level security', t);
    execute format('create policy %I on %I for select to anon, authenticated using (true)', t || '_public_read', t);
    execute format('revoke insert, update, delete, truncate on %I from anon, authenticated', t);
  end loop;
end;
$$;
