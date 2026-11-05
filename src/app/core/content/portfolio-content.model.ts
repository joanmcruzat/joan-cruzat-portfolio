// Contract served by GET /api/content (see api/_lib/content-repository.js).

export interface Profile {
  readonly fullName: string;
  readonly headline: string;
  readonly availability: string;
  readonly heroTitle: string;
  readonly heroHighlight: string;
  readonly summary: string;
  readonly yearsExperience: string;
  readonly focus: readonly string[];
  readonly mindset: readonly string[];
  readonly ticker: readonly string[];
  readonly aboutHeading: string;
  readonly aboutParagraphs: readonly string[];
  readonly aboutQuote: string;
  readonly valuesSummary: string;
  readonly contactHeading: string;
  readonly contactText: string;
  readonly footerTagline: string;
  readonly email: string;
  readonly githubUrl: string;
  readonly linkedinUrl: string;
  readonly resumeUrl: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly ogDescription: string;
}

export interface Experience {
  readonly period: string;
  readonly role: string;
  readonly company: string | null;
  readonly description: string;
  readonly tech: readonly string[];
}

export interface Project {
  readonly title: string;
  readonly tag: string;
  readonly description: string;
  readonly tech: readonly string[];
}

export interface Principle {
  readonly title: string;
  readonly description: string;
}

export interface Tool {
  readonly name: string;
  readonly description: string;
  readonly iconUrl: string;
  readonly iconAlt: string;
}

export interface QualityArea {
  readonly title: string;
  readonly description: string;
}

export interface PortfolioContent {
  readonly profile: Profile;
  readonly experience: readonly Experience[];
  readonly projects: readonly Project[];
  readonly skills: readonly string[];
  readonly principles: readonly Principle[];
  readonly tools: readonly Tool[];
  readonly qualityAreas: readonly QualityArea[];
}
