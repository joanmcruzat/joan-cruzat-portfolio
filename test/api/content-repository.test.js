import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ContentUnavailableError, createContentCache, fetchPortfolioContent, toPortfolioContent
} from "../../api/_lib/content-repository.js";

function profileRow(overrides = {}) {
  return {
    full_name: "Ada Lovelace", headline: "Engineer", availability: "Available", hero_title: "I build",
    hero_highlight: "systems.", summary: "Summary.", years_experience: "8+", focus: [".NET"], mindset: ["reliable"],
    ticker: ["Cloud"], about_heading: "About", about_paragraphs: ["One."], about_quote: "Quote.",
    values_summary: ".NET", contact_heading: "Contact", contact_text: "Talk.", footer_tagline: "Engineer",
    email: "ada@example.com", github_url: "https://github.com/ada", linkedin_url: "https://linkedin.com/in/ada",
    resume_url: "/assets/resume.pdf", meta_title: "Ada", meta_description: "Ada builds.", og_description: "Ada.",
    ...overrides
  };
}

function rows(overrides = {}) {
  return {
    profile: [profileRow()],
    experience: [{ period: "2022 — 2026", role: "Engineer", company: null, description: "Built.", tech: [".NET"] }],
    projects: [{ title: "Payments", tag: "Fintech", description: "Gateway.", tech: ["SQL"] }],
    skills: [{ name: ".NET" }, { name: "Angular" }],
    principles: [{ title: "Performance", description: "Fast." }],
    tools: [{ name: ".NET", description: "Backend", icon_url: "https://example.com/net.svg", icon_alt: ".NET" }],
    qualityAreas: [{ title: "Testing", description: "Unit." }],
    ...overrides
  };
}

// Answers each PostgREST query with the rows for the table named in its path.
function fakeFetch(tables, { status = 200 } = {}) {
  const tableToKey = { profile: "profile", experience: "experience", project: "projects", skill: "skills",
    principle: "principles", tool: "tools", quality_area: "qualityAreas" };
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    const table = new URL(url).pathname.split("/").pop();
    return { ok: status < 400, status, json: async () => tables[tableToKey[table]] };
  };
  return { fetchImpl, calls };
}

describe("toPortfolioContent", () => {
  it("maps database rows to the camelCase content contract", () => {
    const content = toPortfolioContent(rows());

    assert.equal(content.profile.fullName, "Ada Lovelace");
    assert.equal(content.profile.linkedinUrl, "https://linkedin.com/in/ada");
    assert.deepEqual(content.skills, [".NET", "Angular"]);
    assert.deepEqual(content.tools[0], { name: ".NET", description: "Backend", iconUrl: "https://example.com/net.svg", iconAlt: ".NET" });
  });

  it("fails when the profile row is missing", () => {
    assert.throws(() => toPortfolioContent(rows({ profile: [] })), ContentUnavailableError);
  });
});

describe("fetchPortfolioContent", () => {
  it("queries every table with the publishable key, ordered by sort_order", async () => {
    const { fetchImpl, calls } = fakeFetch(rows());

    const content = await fetchPortfolioContent({ url: "https://db.example.com", key: "pk_test", fetchImpl });

    assert.equal(content.projects[0].title, "Payments");
    assert.equal(calls.length, 7);
    assert.ok(calls.every((call) => call.init.headers.apikey === "pk_test"));
    assert.ok(calls.filter((call) => !call.url.includes("/profile?")).every((call) => call.url.endsWith("order=sort_order")));
  });

  it("throws ContentUnavailableError when Supabase answers with an error", async () => {
    const { fetchImpl } = fakeFetch(rows(), { status: 500 });

    await assert.rejects(
      fetchPortfolioContent({ url: "https://db.example.com", key: "pk_test", fetchImpl }),
      ContentUnavailableError
    );
  });

  it("throws ContentUnavailableError when not configured", async () => {
    await assert.rejects(fetchPortfolioContent({ url: "", key: "" }), ContentUnavailableError);
  });
});

describe("createContentCache", () => {
  it("reuses loaded content until the TTL expires", async () => {
    let loads = 0;
    const getContent = createContentCache(async () => ({ version: ++loads }), 1000);

    assert.deepEqual(await getContent(0), { version: 1 });
    assert.deepEqual(await getContent(999), { version: 1 });
    assert.deepEqual(await getContent(1000), { version: 2 });
  });

  it("serves stale content when a reload fails", async (t) => {
    t.mock.method(console, "error", () => {});
    let fail = false;
    const getContent = createContentCache(async () => {
      if (fail) throw new Error("down");
      return { version: 1 };
    }, 1000);

    await getContent(0);
    fail = true;

    assert.deepEqual(await getContent(5000), { version: 1 });
  });

  it("rethrows when nothing has loaded yet", async () => {
    const getContent = createContentCache(async () => { throw new Error("down"); }, 1000);

    await assert.rejects(getContent(0), /down/);
  });
});
