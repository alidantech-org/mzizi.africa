/// <reference types="vite/client" />
import "reflect-metadata";

import { DataSource } from "typeorm";
import { scratchDatabase } from "#/database/scratch-database";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

/**
 * Project-owned: every generated entity must produce valid PostgreSQL DDL. Runs when
 * TEST_DATABASE_URL points at a scratch PostGIS database. The test synchronizes the schema itself;
 * the API never does (schema is owned by source/backend/db-engine).
 */
const adminUrl = process.env.TEST_DATABASE_URL;
const entities = Object.values(
  import.meta.glob("../modules/*/entities/*.entity.ts", { eager: true }) as Record<string, Record<string, Function>>,
).flatMap((module) => Object.values(module));

describe.skipIf(!adminUrl)("generated schema (PostgreSQL)", () => {
  let db: DataSource;

  beforeAll(async () => {
    db = new DataSource({ type: "postgres", url: await scratchDatabase(adminUrl as string, "mzizi_schema_test"), entities, synchronize: true, dropSchema: true });
    await db.initialize();
  });

  afterAll(async () => {
    await db?.destroy();
  });

  it("creates a table for every entity", async () => {
    const rows: Array<{ table_name: string }> = await db.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' AND table_name <> 'spatial_ref_sys'`,
    );
    expect(rows.length).toBe(db.entityMetadatas.length);
    expect(rows.length).toBeGreaterThan(60);
  });

  it("gives every claim-bearing table provenance, valid time and verification columns", async () => {
    const evidenced = db.entityMetadatas.filter((meta) => meta.columns.some((column) => column.propertyName === "sourceName"));
    expect(evidenced.length).toBeGreaterThan(50);
    for (const meta of evidenced) {
      const names = meta.columns.map((column) => column.propertyName);
      for (const required of ["method", "verificationState", "validFrom", "validTo", "isCurrent", "createdAt", "version"]) {
        expect(names, `${meta.tableName} is missing ${required}`).toContain(required);
      }
    }
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
