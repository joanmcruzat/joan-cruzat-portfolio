// The content contract served by GET /api/content (see api/_lib/content-repository.js).
// All copy lives in Supabase; edit db/seed.sql and run `npm run db:seed`.

export interface HeroChip {
  readonly value: string;
  /** Rendered on two lines, split at the line break. */
  readonly label: string;
}

export interface Hero {
  readonly lines: readonly string[];
  readonly accentLine: string;
  readonly lead: string;
  readonly intro: string;
  readonly portraitAlt: string;
  readonly chips: { readonly years: HeroChip; readonly stack: string; readonly volume: HeroChip };
}

export interface Profile {
  readonly fullName: string;
  readonly headline: string;
  readonly availability: string;
  /** Display value such as "9+". */
  readonly yearsExperience: string;
  readonly summary: string;
  readonly hero: Hero;
  readonly marquee: readonly string[];
  readonly email: string;
  readonly githubUrl: string;
  readonly linkedinUrl: string;
  readonly resumeUrl: string;
}

/** An eyebrow plus a heading split around its serif accent. Line breaks in the text are kept. */
export interface SectionCopy {
  readonly eyebrow: string;
  readonly before: string;
  readonly accent: string;
  readonly after: string;
  readonly body: string | null;
}

export type SectionKey = 'work' | 'approach' | 'experience' | 'contact';

/** A headline metric (big number + label) or a short muted note. */
export type ProjectResult =
  | { readonly kind: 'metric'; readonly value: string; readonly label: string }
  | { readonly kind: 'note'; readonly text: string };

export interface Project {
  readonly id: number;
  readonly category: string;
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly result: ProjectResult;
  /** When set, the whole row links to the case study. */
  readonly caseStudyUrl: string | null;
}

export interface Job {
  readonly id: number;
  readonly period: string;
  readonly role: string;
  readonly company: string | null;
  readonly description: string;
}

export interface Principle {
  readonly id: number;
  readonly title: string;
  readonly description: string;
}

export interface StackGroup {
  readonly id: number;
  readonly title: string;
  /** Each entry renders on its own line. */
  readonly lines: readonly string[];
}

export interface PortfolioContent {
  readonly profile: Profile;
  readonly sections: Readonly<Record<SectionKey, SectionCopy>>;
  readonly projects: readonly Project[];
  readonly experience: readonly Job[];
  readonly principles: readonly Principle[];
  readonly stack: readonly StackGroup[];
}

export interface ExternalLink {
  /** Stable name for analytics. */
  readonly id: 'github' | 'linkedin' | 'resume';
  readonly label: string;
  readonly href: string;
}

/** The GitHub / LinkedIn / résumé links shown in the hero and contact sections. */
export function profileLinks(profile: Profile): readonly ExternalLink[] {
  return [
    { id: 'github', label: 'GitHub ↗', href: profile.githubUrl },
    { id: 'linkedin', label: 'LinkedIn ↗', href: profile.linkedinUrl },
    { id: 'resume', label: 'Résumé ↓', href: profile.resumeUrl }
  ];
}
