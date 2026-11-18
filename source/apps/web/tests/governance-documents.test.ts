/// <reference types="bun-types" />
/** Contract-boundary regressions: absence must stay distinct from zero and unsupported data must fail explicitly. */
import { describe, expect, test } from "bun:test";
import {
  comparison,
  tree,
  contentPage,
  directory,
  contentSlug,
} from "#/lib/site/governance/parse/documents.ts";

describe("governance document parsing", () => {
  test("decodes encoded slashes once before the generated content query builder", () => {
    expect(contentSlug("legal%2Fexample.ch-1")).toBe("legal/example.ch-1");
    expect(contentSlug("legal/example.ch-1")).toBe("legal/example.ch-1");
    expect(() => contentSlug("invalid%segment")).toThrow(
      "address is not valid",
    );
  });
  test("keeps missing measurements distinct from recorded zero", () => {
    const parsed = comparison({
      a: null,
      b: null,
      gaps: [],
      rows: [
        {
          code: "measure",
          title: "Measure",
          unit: "%",
          higherIsBetter: true,
          a: 0,
          b: null,
          diffPercent: null,
        },
      ],
    });
    expect(parsed.rows[0]?.a).toBe(0);
    expect(parsed.rows[0]?.b).toBeNull();
    expect(parsed.rows[0]?.diffPercent).toBeNull();
  });
  test("accepts unavailable reference categories without inventing a tab", () => {
    const parsed = tree({
      tab: null,
      place: null,
      nodes: [],
      edges: [],
      rail: [],
      legend: [],
      gaps: ["No category is recorded."],
    });
    expect(parsed.tab).toBeNull();
    expect(parsed.nodes).toHaveLength(0);
    expect(parsed.gaps).toEqual(["No category is recorded."]);
  });
  test("rejects an unknown node kind instead of misrepresenting it", () => {
    expect(() =>
      tree({
        tab: null,
        nodes: [
          {
            id: "1",
            name: "Unknown",
            level: "level",
            type: "unsupported",
            refs: {},
          },
        ],
        edges: [],
        rail: [],
        legend: [],
        gaps: [],
      }),
    ).toThrow("not supported");
  });
  test("rejects a malformed directory instead of displaying zero institutions", () => {
    expect(() =>
      directory({ arms: [], total: "not a count", gaps: [] }),
    ).toThrow("invalid number");
    expect(() => directory({ total: 0, gaps: [] })).toThrow(
      "incomplete collection",
    );
  });
  test("retains the explicit missing-text state", () => {
    const parsed = contentPage({
      content: null,
      related: [],
      gaps: ["No text has been written."],
    });
    expect(parsed.content).toBeNull();
    expect(parsed.gaps).toHaveLength(1);
  });
});
