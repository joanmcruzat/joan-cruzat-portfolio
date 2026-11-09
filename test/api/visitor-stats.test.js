import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fetchVisitorCount, VisitorStatsUnavailableError } from "../../api/_lib/visitor-stats.js";

const NOW = Date.parse("2026-11-09T12:00:00.000Z");
const config = { token: "tok_test", projectId: "prj_1", teamId: "team_1", now: NOW };

function fakeFetch(body, { status = 200 } = {}) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url: new URL(url), init });
    return { ok: status < 400, status, json: async () => body };
  };
  return { fetchImpl, calls };
}

describe("fetchVisitorCount", () => {
  it("asks Vercel for the last 30 days with a bearer token and returns the visitor count", async () => {
    const { fetchImpl, calls } = fakeFetch({ data: { visitors: 42, pageviews: 90 } });

    assert.equal(await fetchVisitorCount({ ...config, fetchImpl }), 42);

    const { url, init } = calls[0];
    assert.equal(url.pathname, "/v1/query/web-analytics/visits/count");
    assert.equal(url.searchParams.get("projectId"), "prj_1");
    assert.equal(url.searchParams.get("teamId"), "team_1");
    assert.equal(url.searchParams.get("since"), "2026-10-10T12:00:00.000Z");
    assert.equal(url.searchParams.get("until"), "2026-11-09T12:00:00.000Z");
    assert.equal(init.headers.Authorization, "Bearer tok_test");
  });

  it("fails when not configured", async () => {
    await assert.rejects(fetchVisitorCount({ token: "", projectId: "" }), VisitorStatsUnavailableError);
  });

  it("fails when Vercel answers with an error", async () => {
    const { fetchImpl } = fakeFetch({}, { status: 403 });

    await assert.rejects(fetchVisitorCount({ ...config, fetchImpl }), /Vercel returned 403/);
  });

  it("fails on an unexpected response shape", async () => {
    const { fetchImpl } = fakeFetch({ data: { visitors: "many" } });

    await assert.rejects(fetchVisitorCount({ ...config, fetchImpl }), /Unexpected response shape/);
  });
});
