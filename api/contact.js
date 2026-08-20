const MAX_BODY = 12000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed" });
  }

  if (!process.env.RESEND_API_KEY || !process.env.JOAN_EMAIL || !process.env.RESEND_FROM) {
    console.error("Missing RESEND_API_KEY, JOAN_EMAIL, or RESEND_FROM");
    return json(res, 500, { error: "Email service is not configured." });
  }

  const raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body ?? {});
  if (raw.length > MAX_BODY) return json(res, 413, { error: "Request is too large." });

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return json(res, 400, { error: "Invalid request body." });
  }

  // Honeypot: bots often fill hidden fields. Silently accept without sending.
  if (body.companyFax) {
    return json(res, 200, { ok: true });
  }

  const name = String(body.name || "").trim();
  const company = String(body.company || "").trim();
  const email = String(body.email || "").trim();
  const role = String(body.role || "").trim();
  const message = String(body.message || "").trim();
  const budget = String(body.budget || "").trim();
  const website = String(body.website || "").trim();

  if (!name || !company || !email || !role || !message) {
    return json(res, 400, { error: "Please complete all required fields." });
  }
  if (!EMAIL_RE.test(email)) {
    return json(res, 400, { error: "Please provide a valid email address." });
  }

  const subject = `New Hire Me Inquiry — ${role}`;
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#20252b">
      <h2>New Hire Me Inquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Company:</strong> ${escapeHtml(company)}</p>
      <p><strong>Work Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Position:</strong> ${escapeHtml(role)}</p>
      <p><strong>Budget / Salary Range:</strong> ${escapeHtml(budget || "Not provided")}</p>
      <p><strong>LinkedIn / Website:</strong> ${escapeHtml(website || "Not provided")}</p>
      <h3>Message</h3>
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      <hr>
      <p><strong>Submission Date:</strong> ${new Date().toISOString()}</p>
    </div>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM,
        to: [process.env.JOAN_EMAIL],
        reply_to: email,
        subject,
        html
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Resend error:", result);
      return json(res, 502, { error: "The email service could not send the inquiry." });
    }

    return json(res, 200, { ok: true, id: result.id });
  } catch (error) {
    console.error("Contact function error:", error);
    return json(res, 500, { error: "Unable to send the inquiry right now." });
  }
}