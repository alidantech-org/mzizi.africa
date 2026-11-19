/// <reference types="bun-types" />
/** Scope filtering keeps only actual edges; graph controls remain accessible in the rendered document. */
import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { GovernanceGraph } from "#/_archives/components/site/leader-tree";
import {
  initialTreeLevel,
  treeAtLevel,
} from "#/_archives/lib/site/governance/tree-view";
import type { GovernanceTree } from "#/_archives/lib/site/governance/contracts";
const document: GovernanceTree = {
  tab: null,
  place: null,
  gaps: [],
  rail: [
    {
      code: "national",
      label: "National",
      about: "National scope",
      count: 0,
      unit: null,
    },
  ],
  legend: [],
  nodes: [
    { id: "root", type: "root", name: "Root", level: "national", refs: {} },
    { id: "local", type: "arm", name: "Local scope", level: "local", refs: {} },
    { id: "child", type: "arm", name: "Child", level: "national", refs: {} },
  ],
  edges: [
    { from: "root", to: "local", kind: "part-of" },
    { from: "local", to: "child", kind: "part-of" },
  ],
} as GovernanceTree;
test("level filtering removes unrelated nodes and does not bridge hidden levels", () => {
  const filtered = treeAtLevel(document, "national");
  expect(filtered.nodes.map((node) => node.id)).toEqual(["root", "child"]);
  expect(filtered.edges).toEqual([]);
  expect(treeAtLevel(document, "")).toBe(document);
  expect(treeAtLevel(document, "missing").nodes).toEqual([]);
});
test("graph renders accessible zoom, fit/reset and bottom level controls", () => {
  const html = renderToStaticMarkup(<GovernanceGraph document={document} />);
  expect(html).toContain('aria-label="Zoom out"');
  expect(html).toContain('aria-label="Zoom in"');
  expect(html).toContain(">Fit</button>");
  expect(html).toContain(">Reset</button>");
  expect(html).toContain('aria-label="Filter leadership by level"');
  expect(html).toContain("Scrollable leadership relationship tree");
  expect(html).toContain("National");
});

test("initial scope prefers populated API levels and leaves unknown empty scopes available", () => {
  expect(initialTreeLevel(document)).toBe("");
  const populated = {
    tab: null,
    place: null,
    gaps: [],
    edges: [],
    legend: [],
    rail: [
      {
        code: "national",
        label: "National",
        about: null,
        count: 1,
        unit: null,
      },
    ],
    nodes: [
      {
        id: "holder",
        name: "Holder",
        type: "leader",
        level: "national",
        refs: {},
        holderId: "id",
        tier: { code: "tier", label: "Tier" },
        how: { code: "method", label: "Method" },
        body: { code: "body", name: "Body" },
        unit: null,
        party: null,
        photo: null,
        since: null,
        performance: null,
      },
    ],
  } as GovernanceTree;
  expect(initialTreeLevel(populated)).toBe("national");
});
