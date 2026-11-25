/** Check the generated client contract and layout without depending on a frontend application. */
import { expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";

function verify(code: string): void {
  const result = Bun.spawnSync(["bun", "-e", code], { stdout: "pipe", stderr: "pipe" });
  if (result.exitCode !== 0) throw new Error(new TextDecoder().decode(result.stderr));
}

test("one registry covers every HTTP operation and encodes path segments", () => {
  verify(`
    import {routes} from "./source/sdk/api-ts/src/routes.ts";
    import catalog from "./source/backend/api/src/system/catalog/catalog.json";
    import {deepStrictEqual,equal} from "node:assert";
    const actual=Object.entries(routes).flatMap(([group,entries])=>Object.keys(entries).map(name=>group+"."+name)).sort();
    const expected=catalog.operations.map(op=>op.group+"."+op.name.charAt(0).toLowerCase()+op.name.slice(1)).sort();
    deepStrictEqual(actual,expected);
    equal(routes.geography.getPlace({code:"a/b?x#é"}),"/v1/geography/places/a%2Fb%3Fx%23%C3%A9");
  `);
});

test("public imports do not expose server requests or runtime helpers", () => {
  verify(`
    import * as entry from "./source/sdk/api-ts/src/index.ts";
    import {strictEqual} from "node:assert";
    strictEqual("api" in entry,false);
    strictEqual("actions" in entry,false);
    strictEqual(Object.values(entry).some(value=>typeof value==="function"),false);
  `);
});

test("source follows the resource layout without legacy shims or versions", () => {
  const source = "source/sdk/api-ts/src";
  expect(readdirSync(source).sort()).toEqual(["actions", "helpers", "index.ts", "routes.ts", "types"]);
  expect(readdirSync(`${source}/helpers`).sort()).toEqual(["api.ts", "enum.ts", "geojson.ts", "helpers.ts", "index.ts"]);
  expect(readdirSync(`${source}/actions`).every((name) => name === "index.ts" || name.endsWith(".actions.ts"))).toBe(true);
  const actionEntries = readdirSync(`${source}/actions`, { withFileTypes: true });
  expect(actionEntries.every((entry) => entry.isFile())).toBe(true);
  const geography = readFileSync(`${source}/actions/geography.actions.ts`, "utf8");
  expect(geography).toContain("export async function geographyGetPlace(");
  expect(geography).toContain("const path = routes.geography.getPlace(input.params);");
  expect(geography).toContain("#sdk/types/geography/dto/place-detail.ts");
  const types = readdirSync(`${source}/types`, { withFileTypes: true });
  for (const entry of types.filter((entry) => entry.isDirectory())) {
    const resource = `${source}/types/${entry.name}`;
    expect(readdirSync(resource).every((name) => ["index.ts", "dto", "enums"].includes(name))).toBe(true);
    expect(readFileSync(`${resource}/index.ts`, "utf8").length).toBeGreaterThan(0);
  }
});
