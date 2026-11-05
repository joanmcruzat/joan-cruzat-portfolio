import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildInquiryEmail, escapeHtml, toInquiry } from "../../api/_lib/inquiry.js";

const valid = { name: " Grace ", company: "Navy", email: "grace@example.com", role: "Engineer", message: "Hi" };

describe("toInquiry", () => {
  it("trims fields and defaults optional ones to empty", () => {
    const { inquiry } = toInquiry(valid);

    assert.equal(inquiry.name, "Grace");
    assert.equal(inquiry.budget, "");
  });

  it("requires every mandatory field", () => {
    assert.equal(toInquiry({ ...valid, role: "  " }).error, "Please complete all required fields.");
  });

  it("rejects an invalid email address", () => {
    assert.equal(toInquiry({ ...valid, email: "nope" }).error, "Please provide a valid email address.");
  });
});

describe("buildInquiryEmail", () => {
  it("escapes visitor input in the HTML body", () => {
    const { inquiry } = toInquiry({ ...valid, message: '<script>alert("x")</script>' });

    const { html, subject } = buildInquiryEmail(inquiry, new Date("2026-11-05T00:00:00Z"));

    assert.equal(subject, "New Hire Me Inquiry — Engineer");
    assert.ok(html.includes("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;"));
    assert.ok(!html.includes("<script>"));
    assert.ok(html.includes("2026-11-05T00:00:00.000Z"));
  });
});

describe("escapeHtml", () => {
  it("escapes all HTML-significant characters", () => {
    assert.equal(escapeHtml(`&<>"'`), "&amp;&lt;&gt;&quot;&#039;");
  });
});
