import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ContentUnavailableError, createContentCache, fetchPortfolioContent, toPortfolioContent
} from "../../api/_lib/content-repository.js";

function profileRow(overrides = {}) {
  return {
    full_name: "Ada Lovelace", headline: "Engineer", availability: "Available", years_experience: "8+",
    summary: "Summary.", hero_lines: ["I build", "things that"], hero_accent: "last.", hero_lead: "Lead.",
    hero_intro: "Intro.", portrait_alt: "Ada", chip_years_label: "years\nshipping", chip_stack: ".NET",
    chip_volume_value: "1k+", chip_volume_label: "users", marquee: ["Cloud"],
    email: "ada@example.com", github_url: "https://github.com/ada", linkedin_url: "https://linkedin.com/in/ada",
    resume_url: "/assets/resume.pdf", meta_title: "Ada", meta_description: "Ada builds.", og_description: "Ada.",
    ...overrides
  };
}

function sectionRow(key) {
  return { key, eyebrow: `${key} eyebrow`, heading_before: "Before ", heading_accent: "accent", heading_after: ".", body: null };
}

function projectRow(overrides = {}) {
  return {
    id: 1, category: "Fintech", title: "Payments", description: "Gateway.", tags: ["SQL"],
    result_value: null, result_label: null, result_note: "Card vault", case_study_url: null, ...overrides
  };
}

function rows(overrides = {}) {
  return {
    profile: [profileRow()],
    sections: ["work", "approach", "experience", "contact"].map(sectionRow),
    projects: [projectRow({ result_value: "10k+", result_label: "transactions", result_note: null }), projectRow({ id: 2 })],
    experience: [{ id: 1, period: "2022 — 2026", role: "Engineer", company: null, description: "Built." }],
    principles: [{ id: 1, title: "Performance", description: "Fast." }],
    stack: [{ id: 1, title: "Backend", lines: [".NET", "REST"] }],
    ...overrides
  };
}

// Answers each PostgREST query with the rows for the table named in its path.
function fakeFetch(tables, { status = 200 } = {}) {
  const tableToKey = { profile: "profile", section: "sections", project: "projects", experience: "experience",
    principle: "principles", stack_group: "stack" };
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
    assert.deepEqual(content.profile.hero.lines, ["I build", "things that"]);
    assert.deepEqual(content.profile.hero.chips.years, { value: "8+", label: "years\nshipping" });
    assert.deepEqual(content.profile.marquee, ["Cloud"]);
    assert.deepEqual(content.sections.work, { eyebrow: "work eyebrow", before: "Before ", accent: "accent", after: ".", body: null });
    assert.deepEqual(content.stack, [{ id: 1, title: "Backend", lines: [".NET", "REST"] }]);
  });

  it("maps a project result to a metric or a note", () => {
    const [metric, note] = toPortfolioContent(rows()).projects;

    assert.deepEqual(metric.result, { kind: "metric", value: "10k+", label: "transactions" });
    assert.deepEqual(note.result, { kind: "note", text: "Card vault" });
    assert.equal(note.caseStudyUrl, null);
  });

  it("fails when the profile row is missing", () => {
    assert.throws(() => toPortfolioContent(rows({ profile: [] })), ContentUnavailableError);
  });

  it("fails when a section heading is missing", () => {
    const sections = ["work", "approach", "experience"].map(sectionRow);

    assert.throws(() => toPortfolioContent(rows({ sections })), /Section "contact" is missing/);
  });
});

describe("fetchPortfolioContent", () => {
  it("queries every table with the publishable key, ordered by sort_order", async () => {
    const { fetchImpl, calls } = fakeFetch(rows());

    const content = await fetchPortfolioContent({ url: "https://db.example.com", key: "pk_test", fetchImpl });

    assert.equal(content.projects[0].title, "Payments");
    assert.equal(calls.length, 6);
    assert.ok(calls.every((call) => call.init.headers.apikey === "pk_test"));
    const ordered = calls.filter((call) => !/\/(profile|section)\?/.test(call.url));
    assert.equal(ordered.length, 4);
    assert.ok(ordered.every((call) => call.url.endsWith("order=sort_order")));
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
