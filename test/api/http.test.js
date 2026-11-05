import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { allowMethods, clientIp, readJsonBody } from "../../api/_lib/http.js";

function fakeResponse() {
  return {
    statusCode: 0,
    headers: {},
    body: "",
    setHeader(name, value) { this.headers[name] = value; },
    end(body) { this.body = body; }
  };
}

describe("readJsonBody", () => {
  it("returns an already-parsed body", () => {
    assert.deepEqual(readJsonBody({ body: { a: 1 } }, 100), { body: { a: 1 } });
  });

  it("parses a raw JSON string", () => {
    assert.deepEqual(readJsonBody({ body: '{"a":1}' }, 100), { body: { a: 1 } });
  });

  it("rejects a body over the size limit with 413", () => {
    assert.equal(readJsonBody({ body: "x".repeat(101) }, 100).status, 413);
  });

  it("rejects malformed JSON with 400", () => {
    assert.equal(readJsonBody({ body: "{nope" }, 100).status, 400);
  });
});

describe("allowMethods", () => {
  it("answers 405 with an Allow header and a problem body for other methods", () => {
    const res = fakeResponse();

    assert.equal(allowMethods({ method: "DELETE" }, res, ["GET"]), false);

    assert.equal(res.statusCode, 405);
    assert.equal(res.headers.Allow, "GET");
    assert.equal(res.headers["Content-Type"], "application/problem+json");
    assert.equal(JSON.parse(res.body).status, 405);
  });

  it("lets allowed methods through untouched", () => {
    const res = fakeResponse();

    assert.equal(allowMethods({ method: "GET" }, res, ["GET"]), true);
    assert.equal(res.statusCode, 0);
  });
});

describe("clientIp", () => {
  it("uses the first x-forwarded-for address", () => {
    assert.equal(clientIp({ headers: { "x-forwarded-for": "1.2.3.4, 10.0.0.1" } }), "1.2.3.4");
  });

  it("falls back to x-real-ip", () => {
    assert.equal(clientIp({ headers: { "x-real-ip": "5.6.7.8" } }), "5.6.7.8");
  });
});
