// Reads portfolio content from Supabase through its REST API (PostgREST) with the
// publishable key. Row-level security limits that key to SELECT on the content tables.

const REQUEST_TIMEOUT_MS = 5000;
const CACHE_TTL_MS = 5 * 60_000;

const QUERIES = {
  profile: "profile?select=*&id=eq.1",
  experience: "experience?select=period,role,company,description,tech&order=sort_order",
  projects: "project?select=title,tag,description,tech&order=sort_order",
  skills: "skill?select=name&order=sort_order",
  principles: "principle?select=title,description&order=sort_order",
  tools: "tool?select=name,description,icon_url,icon_alt&order=sort_order",
  qualityAreas: "quality_area?select=title,description&order=sort_order"
};

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
    heroTitle: row.hero_title,
    heroHighlight: row.hero_highlight,
    summary: row.summary,
    yearsExperience: row.years_experience,
    focus: row.focus,
    mindset: row.mindset,
    ticker: row.ticker,
    aboutHeading: row.about_heading,
    aboutParagraphs: row.about_paragraphs,
    aboutQuote: row.about_quote,
    valuesSummary: row.values_summary,
    contactHeading: row.contact_heading,
    contactText: row.contact_text,
    footerTagline: row.footer_tagline,
    email: row.email,
    githubUrl: row.github_url,
    linkedinUrl: row.linkedin_url,
    resumeUrl: row.resume_url,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    ogDescription: row.og_description
  };
}

// Maps raw PostgREST rows to the content contract served by GET /api/content.
export function toPortfolioContent(rows) {
  if (rows.profile.length !== 1) throw new ContentUnavailableError("Profile row is missing.");
  return {
    profile: toProfile(rows.profile[0]),
    experience: rows.experience,
    projects: rows.projects,
    skills: rows.skills.map((row) => row.name),
    principles: rows.principles,
    tools: rows.tools.map((row) => ({
      name: row.name,
      description: row.description,
      iconUrl: row.icon_url,
      iconAlt: row.icon_alt
    })),
    qualityAreas: rows.qualityAreas
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
