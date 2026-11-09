// Reads the site's unique-visitor count from the Vercel Web Analytics API.
// Needs a Vercel access token (VERCEL_ANALYTICS_TOKEN) that never leaves the server.

const API_URL = "https://api.vercel.com/v1/query/web-analytics/visits/count";
const REQUEST_TIMEOUT_MS = 5000;
const DAY_MS = 24 * 60 * 60 * 1000;
export const WINDOW_DAYS = 30;

export class VisitorStatsUnavailableError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "VisitorStatsUnavailableError";
  }
}

export async function fetchVisitorCount({
  token = process.env.VERCEL_ANALYTICS_TOKEN,
  projectId = process.env.VERCEL_ANALYTICS_PROJECT_ID,
  teamId = process.env.VERCEL_ANALYTICS_TEAM_ID,
  now = Date.now(),
  fetchImpl = fetch
} = {}) {
  if (!token || !projectId) {
    throw new VisitorStatsUnavailableError("VERCEL_ANALYTICS_TOKEN or VERCEL_ANALYTICS_PROJECT_ID is not set.");
  }

  // Vercel rounds both ends down to whole UTC days, so end at the next midnight to include today.
  const until = (Math.floor(now / DAY_MS) + 1) * DAY_MS;
  const query = new URLSearchParams({
    projectId,
    since: new Date(until - WINDOW_DAYS * DAY_MS).toISOString(),
    until: new Date(until).toISOString()
  });
  if (teamId) query.set("teamId", teamId);

  let response;
  try {
    response = await fetchImpl(`${API_URL}?${query}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });
  } catch (error) {
    throw new VisitorStatsUnavailableError("Request to Vercel failed.", { cause: error });
  }
  if (!response.ok) throw new VisitorStatsUnavailableError(`Vercel returned ${response.status}.`);

  const visitors = (await response.json())?.data?.visitors;
  if (!Number.isInteger(visitors) || visitors < 0) {
    throw new VisitorStatsUnavailableError("Unexpected response shape.");
  }
  return visitors;
}
