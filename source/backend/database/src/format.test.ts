import { afterEach, beforeEach, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { formatFile, formatSql } from "./format.ts";

const sample = `-- Generated header. Do not edit.
CREATE SCHEMA "a";
create table "a"."t" ("id" uuid not null, "name" varchar(255) NOT NULL, PRIMARY KEY ("id"));
ALTER TABLE "a"."t" ADD CONSTRAINT "ck_t_name" CHECK ("name" <> '' AND char_length("name") < 200);
`;

let dir: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "mzizi-fmt-"));
});
afterEach(() => rmSync(dir, { recursive: true, force: true }));

test("formatting is idempotent and ends with one newline", () => {
  const once = formatSql(sample);
  expect(formatSql(once)).toBe(once);
  expect(once.endsWith("\n")).toBe(true);
  expect(once.endsWith("\n\n")).toBe(false);
});

test("comments, quoted identifiers and string literals are preserved", () => {
  const out = formatSql(sample);
  expect(out).toContain("-- Generated header. Do not edit.");
  expect(out).toContain('"a"."t"');
  expect(out).toContain("''");
  expect(out).toContain("CREATE TABLE");
});

test("check mode reports a change without writing", () => {
  const path = join(dir, "x.sql");
  writeFileSync(path, sample);
  expect(formatFile(path, true).changed).toBe(true);
  expect(readFileSync(path, "utf8")).toBe(sample);
  expect(formatFile(path).changed).toBe(true);
  expect(formatFile(path, true).changed).toBe(false);
});
