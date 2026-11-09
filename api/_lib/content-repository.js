// Reads portfolio content from Supabase through its REST API (PostgREST) with the
// publishable key. Row-level security limits that key to SELECT on the content tables.

const REQUEST_TIMEOUT_MS = 5000;
const CACHE_TTL_MS = 5 * 60_000;

const QUERIES = {
  profile: "profile?select=*&id=eq.1",
  sections: "section?select=key,eyebrow,heading_before,heading_accent,heading_after,body",
  projects: "project?select=id,category,title,description,tags,result_value,result_label,result_note,case_study_url&order=sort_order",
  experience: "experience?select=id,period,role,company,description&order=sort_order",
  principles: "principle?select=id,title,description&order=sort_order",
  stack: "stack_group?select=id,title,lines&order=sort_order"
};

const SECTION_KEYS = ["work", "approach", "experience", "contact"];

export class ContentUnavailableError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "ContentUnavailableError";
  }
}

function toProfile(row) {
  return {
    fullName: row.full_name,
    headline: row.headline,
    availability: row.availability,
    yearsExperience: row.years_experience,
    summary: row.summary,
    hero: {
      lines: row.hero_lines,
      accentLine: row.hero_accent,
      lead: row.hero_lead,
      intro: row.hero_intro,
      portraitAlt: row.portrait_alt,
      chips: {
        years: { value: row.years_experience, label: row.chip_years_label },
        stack: row.chip_stack,
        volume: { value: row.chip_volume_value, label: row.chip_volume_label }
      }
    },
    marquee: row.marquee,
    email: row.email,
    githubUrl: row.github_url,
    linkedinUrl: row.linkedin_url,
    resumeUrl: row.resume_url,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    ogDescription: row.og_description
  };
}

function toSections(rows) {
  const byKey = new Map(rows.map((row) => [row.key, row]));
  return Object.fromEntries(SECTION_KEYS.map((key) => {
    const row = byKey.get(key);
    if (!row) throw new ContentUnavailableError(`Section "${key}" is missing.`);
    return [key, {
      eyebrow: row.eyebrow,
      before: row.heading_before,
      accent: row.heading_accent,
      after: row.heading_after,
      body: row.body
    }];
  }));
}

// The database check constraint guarantees exactly one of metric or note is set.
function toProjectResult(row) {
  return row.result_value !== null
    ? { kind: "metric", value: row.result_value, label: row.result_label }
    : { kind: "note", text: row.result_note };
}

function toProject(row) {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    description: row.description,
    tags: row.tags,
    result: toProjectResult(row),
    caseStudyUrl: row.case_study_url
  };
}

// Maps raw PostgREST rows to the content contract served by GET /api/content.
export function toPortfolioContent(rows) {
  if (rows.profile.length !== 1) throw new ContentUnavailableError("Profile row is missing.");
  return {
    profile: toProfile(rows.profile[0]),
    sections: toSections(rows.sections),
    projects: rows.projects.map(toProject),
    experience: rows.experience,
    principles: rows.principles,
    stack: rows.stack
  };
}

export async function fetchPortfolioContent({
  url = process.env.SUPABASE_URL,
  key = process.env.SUPABASE_PUBLISHABLE_KEY,
  fetchImpl = fetch
} = {}) {
  if (!url || !key) throw new ContentUnavailableError("SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY is not set.");

  const entries = await Promise.all(
    Object.entries(QUERIES).map(async ([name, query]) => {
      let response;
      try {
        response = await fetchImpl(`${url}/rest/v1/${query}`, {
          headers: { apikey: key, Accept: "application/json" },
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
        });
      } catch (error) {
        throw new ContentUnavailableError(`Request for ${name} failed.`, { cause: error });
      }
      if (!response.ok) throw new ContentUnavailableError(`Request for ${name} returned ${response.status}.`);
      return [name, await response.json()];
    })
  );

  return toPortfolioContent(Object.fromEntries(entries));
}

// Keeps the last good content in the warm function instance so the chat endpoint
// does not hit the database on every message, and serves stale content if Supabase fails.
export function createContentCache(load = fetchPortfolioContent, ttlMs = CACHE_TTL_MS) {
  let cached = null;
  let expiresAt = 0;

  return async function getContent(now = Date.now()) {
    if (cached && now < expiresAt) return cached;
    try {
      cached = await load();
      expiresAt = now + ttlMs;
      return cached;
    } catch (error) {
      if (!cached) throw error;
      console.error("Serving stale portfolio content:", error.message);
      return cached;
    }
  };
}

export const getPortfolioContent = createContentCache();
