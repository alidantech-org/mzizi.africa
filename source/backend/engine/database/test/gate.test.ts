import { describe, expect, test } from "bun:test";

import { evaluate, type AssessmentRecord, type GateRequest } from "../src/gate.ts";

const now = new Date("2026-11-02T10:00:00Z");
const scope = { hosts: ["treasury.go.ke"], schemes: ["https"], paths: { allow: ["/publications/"], deny: ["/publications/internal/"] }, fetchModes: ["http"], maxRequestsPerSecond: 0.5, purposes: ["collect", "publish"] };

const approved = (overrides: Partial<AssessmentRecord> = {}): AssessmentRecord => ({
  id: "a1",
  status: "approved",
  jurisdictionId: "j-ke",
  personalDataCategories: JSON.stringify(["none_known"]),
  approvedScope: JSON.stringify(scope),
  reviewedBy: "reviewer-1",
  reviewedAt: "2026-10-01T00:00:00Z",
  reviewDueAt: "2027-10-01T00:00:00Z",
  ...overrides,
});

const request = (overrides: Partial<GateRequest> = {}): GateRequest => ({ siteId: "s1", host: "treasury.go.ke", path: "/publications/budget.pdf", purpose: "collect", requestsPerSecond: 0.4, now, ...overrides });

describe("collection gate: status", () => {
  test("a site with no assessment may only be assessed, never collected", () => {
    expect(evaluate(undefined, "pilot", request({ purpose: "collect" })).allowed).toBe(false);
    expect(evaluate(undefined, "pilot", request({ purpose: "assess" })).allowed).toBe(true);
  });

  test.each(["not_reviewed", "in_review"] as const)("%s allows bounded assessment only", (status) => {
    expect(evaluate(approved({ status }), "pilot", request({ purpose: "collect" })).allowed).toBe(false);
    const assess = evaluate(approved({ status }), "pilot", request({ purpose: "assess", requestsPerSecond: 5 }));
    expect(assess.allowed).toBe(true);
    expect(assess.limits.requestsPerSecond).toBe(0.5);
  });

  test("assessment requests are limited to GET and HEAD", () => {
    expect(evaluate(undefined, undefined, request({ purpose: "assess", method: "POST" })).allowed).toBe(false);
  });

  test.each(["restricted", "rejected"] as const)("%s denies even assessment contact", (status) => {
    expect(evaluate(approved({ status }), "pilot", request({ purpose: "assess" })).allowed).toBe(false);
    expect(evaluate(approved({ status }), "pilot", request({ purpose: "collect" })).allowed).toBe(false);
  });

  test("expired pauses collection but permits renewing the review", () => {
    expect(evaluate(approved({ status: "expired" }), "pilot", request({ purpose: "collect" })).allowed).toBe(false);
    expect(evaluate(approved({ status: "expired" }), "pilot", request({ purpose: "assess" })).allowed).toBe(true);
  });

  test("an approval past its review date is treated as expired", () => {
    const decision = evaluate(approved({ reviewDueAt: "2026-10-31T00:00:00Z" }), "pilot", request());
    expect(decision.allowed).toBe(false);
    expect(decision.reasons.join(" ")).toContain("overdue");
  });

  test("an approval needs an accountable approving account", () => {
    expect(evaluate(approved({ reviewedBy: null }), "pilot", request()).allowed).toBe(false);
  });
});

describe("collection gate: scope and jurisdiction", () => {
  test("an approved request inside scope is allowed with the scope's rate limit", () => {
    const decision = evaluate(approved(), "pilot", request());
    expect(decision).toMatchObject({ allowed: true, assessmentId: "a1", limits: { requestsPerSecond: 0.5 } });
  });

  test("denies other hosts, denied paths, paths outside the allow list, other schemes, other fetch modes and faster rates", () => {
    expect(evaluate(approved(), "pilot", request({ host: "other.go.ke" })).allowed).toBe(false);
    expect(evaluate(approved(), "pilot", request({ path: "/publications/internal/x.pdf" })).allowed).toBe(false);
    expect(evaluate(approved(), "pilot", request({ path: "/admin/" })).allowed).toBe(false);
    expect(evaluate(approved(), "pilot", request({ scheme: "http" })).allowed).toBe(false);
    expect(evaluate(approved(), "pilot", request({ fetchMode: "browser" })).allowed).toBe(false);
    expect(evaluate(approved(), "pilot", request({ requestsPerSecond: 2 })).allowed).toBe(false);
  });

  test("fails closed on an unparseable scope", () => {
    expect(evaluate(approved({ approvedScope: "{oops" }), "pilot", request()).allowed).toBe(false);
  });

  test("requires a jurisdiction and a dossier at pilot or production", () => {
    expect(evaluate(approved({ jurisdictionId: null }), "pilot", request()).allowed).toBe(false);
    expect(evaluate(approved(), undefined, request()).allowed).toBe(false);
    expect(evaluate(approved(), "research", request()).allowed).toBe(false);
    expect(evaluate(approved(), "production", request()).allowed).toBe(true);
  });

  test("expected personal data needs a recorded lawful basis", () => {
    const withPersonalData = approved({ personalDataCategories: JSON.stringify(["office_holder_names"]) });
    expect(evaluate(withPersonalData, "pilot", request()).allowed).toBe(false);
    expect(evaluate({ ...withPersonalData, lawfulBasis: "public task, documented in the DPIA" }, "pilot", request()).allowed).toBe(true);
  });
});

describe("collection gate: conditions", () => {
  const conditional = (conditions: unknown) => approved({ status: "approved_with_conditions", conditions: JSON.stringify(conditions) });

  test("conditions can tighten the rate and are enforced", () => {
    const decision = evaluate(conditional([{ type: "max_requests_per_second", value: 0.1 }]), "pilot", request({ requestsPerSecond: 0.1 }));
    expect(decision).toMatchObject({ allowed: true, limits: { requestsPerSecond: 0.1 } });
    expect(evaluate(conditional([{ type: "max_requests_per_second", value: 0.1 }]), "pilot", request({ requestsPerSecond: 0.4 })).allowed).toBe(false);
  });

  test("a no_publish condition blocks publication but not collection", () => {
    expect(evaluate(conditional([{ type: "no_publish" }]), "pilot", request({ purpose: "publish" })).allowed).toBe(false);
    expect(evaluate(conditional([{ type: "no_publish" }]), "pilot", request({ purpose: "collect" })).allowed).toBe(true);
  });

  test("an excluded path condition denies matching paths", () => {
    expect(evaluate(conditional([{ type: "excluded_paths", value: ["/publications/draft/"] }]), "pilot", request({ path: "/publications/draft/a.pdf" })).allowed).toBe(false);
  });

  test("a condition the engine cannot enforce fails closed, and so does an empty conditions list", () => {
    expect(evaluate(conditional([{ type: "notify_regulator_monthly" }]), "pilot", request()).allowed).toBe(false);
    expect(evaluate(conditional([]), "pilot", request()).allowed).toBe(false);
  });
});

describe("collection gate: shared vectors (same file the Python gate is tested with)", () => {
  const { readFileSync } = require("node:fs") as typeof import("node:fs");
  const file = JSON.parse(readFileSync(new URL("../../../contracts/gate-vectors.json", import.meta.url), "utf8"));
  for (const vector of file.vectors) {
    test(vector.name, () => {
      const assessment = vector.assessment === null ? undefined : { ...file.base.assessment, ...(vector.assessment ?? {}) };
      const stage = "dossierStage" in vector ? vector.dossierStage ?? undefined : file.base.dossierStage;
      const decision = evaluate(assessment, stage, { ...file.base.request, ...(vector.request ?? {}), now: new Date(file.now) });
      expect(decision.allowed).toBe(vector.expect.allowed);
      if (vector.expect.reason) expect(decision.reasons.join(" | ")).toContain(vector.expect.reason);
      if (vector.expect.requestsPerSecond !== undefined) expect(decision.limits.requestsPerSecond).toBe(vector.expect.requestsPerSecond);
    });
  }
});
