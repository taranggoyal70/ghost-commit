import assert from "node:assert/strict";
import { test } from "node:test";

import { scoreRepository } from "../lib/repo-health";

test("popular dormant repo is a strong resurrection candidate", () => {
  const h = scoreRepository({
    pushedAt: "2023-01-01T00:00:00Z",
    now: "2025-01-01T00:00:00Z",
    archived: false,
    stars: 1000,
    openIssues: 20,
    hasReadme: true,
    license: "MIT",
  });
  assert.equal(h.dormancy, "dormant");
  assert.ok(h.score >= 45);
  assert.equal(h.recommend, true);
});

test("active repo is not recommended", () => {
  const h = scoreRepository({
    pushedAt: "2024-12-15T00:00:00Z",
    now: "2025-01-01T00:00:00Z",
    archived: false,
    stars: 5,
    openIssues: 0,
    hasReadme: true,
    license: "MIT",
  });
  assert.equal(h.dormancy, "active");
  assert.equal(h.recommend, false);
});

test("archived repos are penalized and never recommended", () => {
  const h = scoreRepository({
    pushedAt: "2022-01-01T00:00:00Z",
    now: "2025-01-01T00:00:00Z",
    archived: true,
    stars: 1000,
    openIssues: 0,
    hasReadme: true,
    license: "MIT",
  });
  assert.equal(h.recommend, false);
  assert.ok(h.signals.some((s) => s.includes("archived")));
});

test("missing README and license surface as signals", () => {
  const h = scoreRepository({
    pushedAt: "2023-06-01T00:00:00Z",
    now: "2025-01-01T00:00:00Z",
    archived: false,
    stars: 0,
    openIssues: 0,
    hasReadme: false,
    license: null,
  });
  assert.ok(h.signals.some((s) => s.toLowerCase().includes("readme")));
  assert.ok(h.signals.some((s) => s.toLowerCase().includes("license")));
});
