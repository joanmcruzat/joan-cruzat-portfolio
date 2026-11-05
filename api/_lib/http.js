// Shared request/response helpers for the Vercel functions in /api.
// Files under api/_lib are not deployed as endpoints (Vercel skips "_" paths).

export function sendJson(res, status, body, headers = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  for (const [name, value] of Object.entries(headers)) res.setHeader(name, value);
  res.end(JSON.stringify(body));
}

// RFC 9457 problem details. `detail` is always safe to show to visitors.
export function sendProblem(res, status, title, detail, headers = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/problem+json");
  for (const [name, value] of Object.entries(headers)) res.setHeader(name, value);
  res.end(JSON.stringify({ type: "about:blank", title, status, detail }));
}

// Returns true when the method is allowed; otherwise answers 405 and returns false.
export function allowMethods(req, res, methods) {
  if (methods.includes(req.method)) return true;
  sendProblem(res, 405, "Method Not Allowed", "This endpoint does not support that method.", {
    Allow: methods.join(", ")
  });
  return false;
}

// Parses the JSON body Vercel hands us (already parsed object, or raw string).
// Returns { body } on success or { status, title, detail } describing the failure.
export function readJsonBody(req, maxChars) {
  const raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body ?? {});
  if (raw.length > maxChars) {
    return { status: 413, title: "Payload Too Large", detail: "Request is too large." };
  }
  if (typeof req.body !== "string") return { body: req.body || {} };
  try {
    return { body: JSON.parse(req.body) };
  } catch {
    return { status: 400, title: "Bad Request", detail: "Invalid request body." };
  }
}

export function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded || "").split(",")[0].trim();
  return first || req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
}
