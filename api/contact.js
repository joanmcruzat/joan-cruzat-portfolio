import { allowMethods, readJsonBody, sendJson, sendProblem } from "./_lib/http.js";
import { buildInquiryEmail, toInquiry } from "./_lib/inquiry.js";

const MAX_BODY = 12000;

// Public endpoint (no auth): the Hire Me form is for anonymous visitors. Abuse is
// limited by the honeypot field and request size cap.
export default async function handler(req, res) {
  if (!allowMethods(req, res, ["POST"])) return;

  if (!process.env.RESEND_API_KEY || !process.env.JOAN_EMAIL || !process.env.RESEND_FROM) {
    console.error("Missing RESEND_API_KEY, JOAN_EMAIL, or RESEND_FROM");
    return sendProblem(res, 500, "Internal Server Error", "Email service is not configured.");
  }

  const parsed = readJsonBody(req, MAX_BODY);
  if (!parsed.body) return sendProblem(res, parsed.status, parsed.title, parsed.detail);

  // Honeypot: bots often fill hidden fields. Silently accept without sending.
  if (parsed.body.companyFax) return sendJson(res, 200, { ok: true });

  const { inquiry, error } = toInquiry(parsed.body);
  if (error) return sendProblem(res, 400, "Bad Request", error);

  const { subject, html } = buildInquiryEmail(inquiry);

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
        reply_to: inquiry.email,
        subject,
        html
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Resend error:", result);
      return sendProblem(res, 502, "Bad Gateway", "The email service could not send the inquiry.");
    }

    return sendJson(res, 200, { ok: true, id: result.id });
  } catch (error) {
    console.error("Contact function error:", error);
    return sendProblem(res, 500, "Internal Server Error", "Unable to send the inquiry right now.");
  }
}
