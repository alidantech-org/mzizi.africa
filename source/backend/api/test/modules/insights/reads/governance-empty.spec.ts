/** Empty and unavailable governance views must remain renderable instead of failing or changing category silently. */
import "reflect-metadata";
import { DataSource } from "typeorm";
import { describe, expect, it, vi } from "vitest";
import { governanceTree } from "#/modules/insights/features/insights/reads/govtree.ts";

describe("governance tree gaps", () => {
  it("returns an empty document when no categories have been configured", async () => {
    const db = new DataSource({ type: "postgres" });
    vi.spyOn(db, "query").mockResolvedValue([]);
    const tree = await governanceTree(db, {});
    expect(tree.tab).toBeNull();
    expect(tree.nodes).toEqual([]);
    expect(tree.edges).toEqual([]);
    expect(tree.rail).toEqual([]);
    expect(tree.gaps).toEqual(["No ways of grouping leaders are defined yet."]);
  });

  it("does not show a different category when the requested one is unavailable", async () => {
    const db = new DataSource({ type: "postgres" });
    const query = vi.spyOn(db, "query").mockResolvedValue([
      { code: "ref.val.gov.leader.tab.elected", label: "Elected", about: null, kinds: [] },
    ]);
    const tree = await governanceTree(db, { tab: "missing" });
    expect(tree.tab).toBeNull();
    expect(tree.nodes).toEqual([]);
    expect(tree.gaps[0]).toContain("not recorded");
    expect(query).toHaveBeenCalledTimes(1);
  });
});
