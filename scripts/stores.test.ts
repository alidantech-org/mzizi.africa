/** Store assignment and generation-scope regressions without database or workspace writes. */
import { expect, test } from "bun:test";
import { auditStoreAssignments } from "../dryv/tools/stores/audit.ts";
import { parseStoreAssignments } from "../dryv/tools/stores/parse.ts";
import { legacyApiSelection } from "./tasks/dryv.ts";

function fixture(store = "main"): string {
  return JSON.stringify({
    type: "batch",
    items: [
      { kind: "store", name: "main", value: {} },
      { kind: "store", name: "operations", value: {} },
      { kind: "group", name: "domain", value: { facets: { storage: { namespace: "domain", store: { $ref: `#/stores/${store}` } } } } },
      {
        kind: "schema",
        name: "domain.Entity",
        value: { group: { $ref: "#/groups/domain" }, role: "entity", facets: { storage: { name: "entities" } } },
      },
      { kind: "schema", name: "domain.View", value: { group: { $ref: "#/groups/domain" }, role: "view-model" } },
    ],
  });
}
test("canonical group store selects concrete entities while views remain non-persisted", () => {
  const result = auditStoreAssignments(parseStoreAssignments(fixture()));
  expect(result.problems).toEqual([]);
  expect([...result.tables]).toEqual([["main", 1]]);
});
test("undefined canonical stores fail instead of inheriting a namespace list", () => {
  expect(auditStoreAssignments(parseStoreAssignments(fixture("missing"))).problems).toEqual([
    "domain.Entity: missing or undefined store missing",
  ]);
});
test("malformed store references fail at the parsing boundary", () => {
  expect(() => parseStoreAssignments(fixture().replace("#/stores/main", "#/schemas/main"))).toThrow("expected #/stores/ reference");
});
test("legacy API selection never pulls database foundation packs into its follow-up workflow", () => {
  expect(legacyApiSelection()).toEqual([
    "--pack",
    "types",
    "--pack",
    "dtos",
    "--pack",
    "entities",
    "--pack",
    "type-files",
    "--pack",
    "use-cases",
    "--pack",
    "server",
  ]);
});
