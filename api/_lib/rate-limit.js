// Best-effort per-key rate limiting. State lives in the function instance's memory,
// so it is shared by requests that reach the same warm instance but not across
// instances or regions. Pair it with a Vercel Firewall rate-limit rule for a hard limit.
export function createRateLimiter(limits, maxTrackedKeys = 5000) {
  const hits = new Map(); // key -> array of request timestamps (ms)
  const longest = Math.max(...limits.map((limit) => limit.windowMs));

  // Returns the number of seconds to wait, or 0 if the request is allowed.
  return function check(key, now = Date.now()) {
    const recent = (hits.get(key) || []).filter((t) => now - t < longest);

    for (const { windowMs, max } of limits) {
      const inWindow = recent.filter((t) => now - t < windowMs);
      if (inWindow.length >= max) {
        hits.set(key, recent);
        return Math.ceil((inWindow[0] + windowMs - now) / 1000);
      }
    }

    recent.push(now);
    hits.delete(key); // re-insert so Map order tracks least-recently-used
    hits.set(key, recent);
    if (hits.size > maxTrackedKeys) hits.delete(hits.keys().next().value);
    return 0;
  };
}
