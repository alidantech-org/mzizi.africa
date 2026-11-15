import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { reconcile } from "./ledger.ts";
import { assemble, checksum, loadReleases } from "./releases.ts";

let dir: string;
let snapshot: string;
let stream: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "mzizi-db-"));
  snapshot = join(dir, "schema.sql");
  stream = join(dir, "migrations");
});
afterEach(() => rmSync(dir, { recursive: true, force: true }));

describe("assemble", () => {
  test("an empty stream receives the initial release and a checksum record", () => {
    writeFileSync(snapshot, "CREATE SCHEMA a;\n");
    expect(assemble(snapshot, stream)).toBe("initial");
    expect(readFileSync(join(stream, "0001_init.sql"), "utf8")).toBe("CREATE SCHEMA a;\n");
    expect(readFileSync(join(stream, ".snapshot"), "utf8").trim()).toBe(checksum("CREATE SCHEMA a;\n"));
  });

  test("the same snapshot is up to date", () => {
    writeFileSync(snapshot, "CREATE SCHEMA a;\n");
    assemble(snapshot, stream);
    expect(assemble(snapshot, stream)).toBe("up-to-date");
  });

  test("a changed snapshot is refused and the release stays untouched", () => {
    writeFileSync(snapshot, "CREATE SCHEMA a;\n");
    assemble(snapshot, stream);
    writeFileSync(snapshot, "CREATE SCHEMA b;\n");
    expect(() => assemble(snapshot, stream)).toThrow("immutable");
    expect(readFileSync(join(stream, "0001_init.sql"), "utf8")).toBe("CREATE SCHEMA a;\n");
  });

  test("a missing snapshot explains how to generate it", () => {
    expect(() => assemble(snapshot, stream)).toThrow("dryv:database:generate");
  });
});

describe("reconcile", () => {
  const release = (name: string, sql: string) => ({ name, sql, checksum: checksum(sql) });

  test("releases not in the ledger are pending", () => {
    const releases = [release("0001_init", "a"), release("0002_more", "b")];
    const result = reconcile(releases, [{ name: "0001_init", checksum: checksum("a") }]);
    expect(result.pending.map((entry) => entry.name)).toEqual(["0002_more"]);
  });

  test("a changed applied release is refused", () => {
    expect(() => reconcile([release("0001_init", "a2")], [{ name: "0001_init", checksum: checksum("a") }])).toThrow(
      "changed after it was applied",
    );
  });

  test("an applied release missing on disk is refused", () => {
    expect(() => reconcile([], [{ name: "0001_init", checksum: checksum("a") }])).toThrow("missing on disk");
  });
});

test("loadReleases returns ordered releases and tolerates a missing directory", () => {
  expect(loadReleases(stream)).toEqual([]);
  writeFileSync(snapshot, "x");
  assemble(snapshot, stream);
  writeFileSync(join(stream, "0002_next.sql"), "y");
  expect(loadReleases(stream).map((entry) => entry.name)).toEqual(["0001_init", "0002_next"]);
});
