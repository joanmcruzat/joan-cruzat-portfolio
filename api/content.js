import { getPortfolioContent } from "./_lib/content-repository.js";
import { allowMethods, sendJson, sendProblem } from "./_lib/http.js";

// Public endpoint (no auth): it serves the portfolio's published content, which is
// meant for every visitor. The CDN caches it so most visits never reach Supabase.
const CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=86400";

export default async function handler(req, res) {
  if (!allowMethods(req, res, ["GET"])) return;

  try {
    const content = await getPortfolioContent();
    return sendJson(res, 200, content, { "Cache-Control": CACHE_CONTROL });
  } catch (error) {
    console.error("Content function error:", error);
    return sendProblem(res, 503, "Service Unavailable", "Portfolio content is unavailable right now.", {
      "Cache-Control": "no-store"
    });
  }
}
