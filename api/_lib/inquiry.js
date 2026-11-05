// Validation and email rendering for Hire Me inquiries.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUIRED_FIELDS = ["name", "company", "email", "role", "message"];
const OPTIONAL_FIELDS = ["budget", "website"];

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Returns { inquiry } with trimmed fields, or { error } with a visitor-safe message.
export function toInquiry(body) {
  const inquiry = {};
  for (const field of [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS]) {
    inquiry[field] = String(body[field] || "").trim();
  }
  if (REQUIRED_FIELDS.some((field) => !inquiry[field])) {
    return { error: "Please complete all required fields." };
  }
  if (!EMAIL_RE.test(inquiry.email)) {
    return { error: "Please provide a valid email address." };
  }
  return { inquiry };
}

export function buildInquiryEmail(inquiry, submittedAt = new Date()) {
  const subject = `New Hire Me Inquiry — ${inquiry.role}`;
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#20252b">
      <h2>New Hire Me Inquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(inquiry.name)}</p>
      <p><strong>Company:</strong> ${escapeHtml(inquiry.company)}</p>
      <p><strong>Work Email:</strong> ${escapeHtml(inquiry.email)}</p>
      <p><strong>Position:</strong> ${escapeHtml(inquiry.role)}</p>
      <p><strong>Budget / Salary Range:</strong> ${escapeHtml(inquiry.budget || "Not provided")}</p>
      <p><strong>LinkedIn / Website:</strong> ${escapeHtml(inquiry.website || "Not provided")}</p>
      <h3>Message</h3>
      <p style="white-space:pre-wrap">${escapeHtml(inquiry.message)}</p>
      <hr>
      <p><strong>Submission Date:</strong> ${submittedAt.toISOString()}</p>
    </div>
  `;
  return { subject, html };
}
