/// <reference types="vite/client" />
import "reflect-metadata";

import { DataSource } from "typeorm";
import { scratchDatabase, synchronizeDomainSchemas } from "#/database/scratch-database";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

/**
 * Project-owned: every generated entity must produce valid PostgreSQL DDL. Runs when
 * TEST_DATABASE_URL points at a scratch PostGIS database. The test synchronizes the schema itself;
 * the API never does (schema is owned by source/backend/engine/database).
 */
const adminUrl = process.env.TEST_DATABASE_URL;
const entities = Object.values(
  import.meta.glob("../modules/*/entities/*.entity.ts", { eager: true }) as Record<string, Record<string, Function>>,
).flatMap((module) => Object.values(module));

describe.skipIf(!adminUrl)("generated schema (PostgreSQL)", () => {
  let db: DataSource;

  beforeAll(async () => {
    db = new DataSource({ type: "postgres", url: await scratchDatabase(adminUrl as string, "mzizi_test"), entities, synchronize: false });
    await db.initialize();
    await synchronizeDomainSchemas(db);
  });

  afterAll(async () => {
    await db?.destroy();
  });

  it("creates a table for every entity", async () => {
    const rows: Array<{ table_schema: string; table_name: string }> = await db.query(
      `SELECT table_schema, table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE' AND table_schema NOT IN ('public', 'pg_catalog', 'information_schema')`,
    );
    expect(rows.length).toBe(db.entityMetadatas.length);
    expect(rows.length).toBeGreaterThan(80);
  });

  it("keeps every table out of public and in its domain schema", async () => {
    expect(db.entityMetadatas.every((meta) => meta.schema && meta.schema !== "public")).toBe(true);
    const inPublic: Array<{ table_name: string }> = await db.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' AND table_name <> 'spatial_ref_sys'`,
    );
    expect(inPublic).toEqual([]);
    for (const meta of db.entityMetadatas) {
      expect(meta.tableName, `${meta.schema}.${meta.tableName} repeats its schema`).not.toMatch(new RegExp(`^${meta.schema}_`));
    }
  });

  it("keeps provenance out of data tables: it lives in the source schema", () => {
    const provenance = ["sourceName", "sourceReference", "sourceUrl", "artifactId", "artifactChecksum", "retrievedAt", "licence", "method", "toolOrModel", "confidence", "verificationState"];
    for (const meta of db.entityMetadatas.filter((entity) => entity.schema !== "source")) {
      const names = meta.columns.map((column) => column.propertyName);
      for (const field of provenance) expect(names, `${meta.schema}.${meta.tableName} has ${field}`).not.toContain(field);
    }
    const attributions = db.entityMetadatas.find((meta) => meta.schema === "source" && meta.tableName === "attributions");
    expect(attributions?.columns.map((column) => column.propertyName)).toEqual(expect.arrayContaining(["targetKind", "targetId", "documentId", "methodId", "relation"]));
  });

  it("gives every domain table valid time, record time and a version", () => {
    const system = new Set(["audit", "source", "filesystem", "identity", "website"]); // the site registry records observations (observedAt), not valid time
    const domain = db.entityMetadatas.filter((meta) => !system.has(meta.schema as string));
    expect(domain.length).toBeGreaterThan(40);
    for (const meta of domain) {
      const names = meta.columns.map((column) => column.propertyName);
      for (const required of ["validFrom", "validTo", "isCurrent", "createdAt", "version"]) {
        expect(names, `${meta.schema}.${meta.tableName} is missing ${required}`).toContain(required);
      }
    }
  });

  it("has no foreign key from one schema to another", async () => {
    const crossing: Array<{ from: string; to: string }> = await db.query(`
      SELECT c.conrelid::regclass::text AS "from", c.confrelid::regclass::text AS "to"
        FROM pg_constraint c
        JOIN pg_class a ON a.oid = c.conrelid JOIN pg_class b ON b.oid = c.confrelid
       WHERE c.contype = 'f' AND a.relnamespace <> b.relnamespace`);
    expect(crossing).toEqual([]);
  });

  it("stores no money without a currency", () => {
    const money = db.entityMetadatas.flatMap((meta) =>
      meta.columns
        .filter((column) => column.type === "numeric" && /amount|principal|paid|estimatedvalue|^value$/i.test(column.propertyName))
        .map((column) => ({ meta, column })),
    );
    for (const { meta, column } of money) {
      expect(
        meta.columns.some((other) => other.propertyName === "currencyCode"),
        `${meta.tableName}.${column.propertyName} has no currencyCode`,
      ).toBe(true);
    }
  });
});
