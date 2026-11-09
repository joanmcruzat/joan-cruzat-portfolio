import { allowMethods, sendJson, sendProblem } from "./_lib/http.js";
import { fetchVisitorCount, WINDOW_DAYS } from "./_lib/visitor-stats.js";

// Public endpoint (no auth): it serves one aggregate number shown in the site footer.
// The CDN caches it for an hour, so visits never call the Vercel API directly.
const CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";

export default async function handler(req, res) {
  if (!allowMethods(req, res, ["GET"])) return;

  try {
    const visitors = await fetchVisitorCount();
    return sendJson(res, 200, { visitors, days: WINDOW_DAYS }, { "Cache-Control": CACHE_CONTROL });
  } catch (error) {
    console.error("Visitors function error:", error.message);
    return sendProblem(res, 503, "Service Unavailable", "Visitor stats are unavailable right now.", {
      "Cache-Control": "public, s-maxage=300"
    });
  }
}
