-- Reshapes the content tables for the redesigned page: hero copy and chips, project
-- results, stack groups and section headings move into the database, and the columns
-- and tables only the old page used are dropped. Run `npm run db:seed` right after.

-- Profile: hero copy and portrait chips in; old about/contact/footer copy out.
alter table profile
  add column hero_lines        text[]        not null default '{}',
  add column hero_lead         varchar(300)  not null default '',
  add column hero_intro        varchar(500)  not null default '',
  add column portrait_alt      varchar(150)  not null default '',
  add column chip_years_label  varchar(60)   not null default '',
  add column chip_stack        varchar(60)   not null default '',
  add column chip_volume_value varchar(20)   not null default '',
  add column chip_volume_label varchar(60)   not null default '';

alter table profile
  drop column hero_title,
  drop column focus,
  drop column mindset,
  drop column about_heading,
  drop column about_paragraphs,
  drop column about_quote,
  drop column values_summary,
  drop column contact_heading,
  drop column contact_text,
  drop column footer_tagline;

alter table profile rename column hero_highlight to hero_accent;
alter table profile rename column ticker to marquee;

-- Experience: the tech list is no longer shown.
alter table experience drop column tech;

-- Project: a result is either a metric (value + label) or a short note, never both.
alter table project rename column tag to category;
alter table project rename column tech to tags;
alter table project
  add column result_value   varchar(20),
  add column result_label   varchar(60),
  add column result_note    varchar(120),
  add column case_study_url varchar(300);

update project set result_note = '' where result_value is null and result_note is null;

alter table project add constraint ck_project_result check (
  (result_value is not null and result_label is not null and result_note is null)
  or (result_value is null and result_label is null and result_note is not null)
);

-- Stack: grouped lines shown under the experience timeline.
create table stack_group (
  id           integer generated always as identity primary key,
  sort_order   smallint      not null unique,
  title        varchar(60)   not null,
  lines        text[]        not null default '{}',
  created_at   timestamptz   not null default now(),
  updated_at   timestamptz   not null default now()
);

-- Section headings: eyebrow plus a heading split around its serif accent word(s).
create table section (
  key            varchar(20)   primary key check (key in ('work', 'approach', 'experience', 'contact')),
  eyebrow        varchar(60)   not null,
  heading_before varchar(150)  not null default '',
  heading_accent varchar(60)   not null default '',
  heading_after  varchar(150)  not null default '',
  body           varchar(500),
  created_at     timestamptz   not null default now(),
  updated_at     timestamptz   not null default now()
);

drop table skill, tool, quality_area;

do $$
declare
  t text;
begin
  foreach t in array array['stack_group', 'section'] loop
    execute format('create trigger %I before update on %I for each row execute function set_updated_at()', t || '_set_updated_at', t);
    execute format('alter table %I enable row level security', t);
    execute format('create policy %I on %I for select to anon, authenticated using (true)', t || '_public_read', t);
    execute format('revoke insert, update, delete, truncate on %I from anon, authenticated', t);
  end loop;
end;
$$;
