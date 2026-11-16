/** The committed release stream and the committed snapshot agree. */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { assemble, checksum, loadReleases } from "./releases.ts";

const root = join(import.meta.dir, "..");
const snapshot = join(root, "sql", "schema.sql");
const stream = join(root, "migrations");

describe("the committed stream", () => {
  test("is numbered without gaps from 0001", () => {
    const names = loadReleases(stream).map((release) => release.name);
    expect(names.length).toBeGreaterThan(0);
    names.forEach((name, index) => expect(name.startsWith(String(index + 1).padStart(4, "0") + "_")).toBe(true));
  });

  test("records the checksum of the committed snapshot, so assemble finds nothing to do", () => {
    expect(readFileSync(join(stream, ".snapshot"), "utf8").trim()).toBe(checksum(readFileSync(snapshot, "utf8")));
    expect(assemble(snapshot, stream)).toBe("up-to-date");
  });
});
