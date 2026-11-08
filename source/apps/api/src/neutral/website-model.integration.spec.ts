/// <reference types="vite/client" />
import "reflect-metadata";

import { DataSource } from "typeorm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { scratchDatabase, synchronizeDomainSchemas } from "#/database/scratch-database";
import { loadFixtures, readFixture, readSeed } from "#/neutral/fixture-loader";

/**
 * Sites are identified by their own id, not by a domain: a hostname can belong to different sites
 * over time, families own domain patterns, and sites link to the places and bodies they are about.
 * Fixture: seed/fixtures/neutral-model/kenya-sites.json; media formats: seed/global/reference/media-formats.json (worked examples).
 */
const adminUrl = process.env.TEST_DATABASE_URL;
const entities = Object.values(
  import.meta.glob("../modules/*/entities/*.entity.ts", { eager: true }) as Record<string, Record<string, Function>>,
).flatMap((module) => Object.values(module));

describe.skipIf(!adminUrl)("website model (Kenyan site families)", () => {
  let db: DataSource;

  beforeAll(async () => {
    const dbUrl = await scratchDatabase(adminUrl as string, "mzizi_test");
    db = new DataSource({ type: "postgres", url: dbUrl, entities, synchronize: false });
    await db.initialize();
    await synchronizeDomainSchemas(db);
    const ids = await loadFixtures(db, readSeed("global/reference/media-formats.json").rows);
    await loadFixtures(db, readFixture("kenya").rows, ids);
    await loadFixtures(db, readFixture("kenya-sites").rows, ids);
  });

  afterAll(async () => {
    await db?.destroy();
  });

  it("lets one hostname belong to different sites in different periods", async () => {
    const rows = await db.query(`SELECT site_id FROM website.domains WHERE hostname = 'finance-portal.example' ORDER BY valid_from`);
    expect(rows).toHaveLength(2);
    expect(new Set(rows.map((row: { site_id: string }) => row.site_id)).size).toBe(2);
  });

  it("keeps a legacy domain as history on the same site", async () => {
    const rows = await db.query(`SELECT d.role FROM website.domains d JOIN website.sites s ON s.id = d.site_id WHERE s.code = 'ke/treasury' ORDER BY d.valid_from`);
    expect(rows.map((row: { role: string }) => row.role)).toContain("legacy");
    expect(rows.map((row: { role: string }) => row.role)).toContain("primary");
  });

  it("holds domain patterns for the four geographic and institutional families", async () => {
    const rows = await db.query(`SELECT p.template FROM website.domain_patterns p ORDER BY p.template`);
    const templates = rows.map((row: { template: string }) => row.template).sort();
    expect(templates).toEqual(["{constituency}.ngcdf.go.ke", "{county}.go.ke", "{county}assembly.go.ke", "{ministry}.go.ke"].sort());
  });

  it("relates independent bodies by shared traits and a shared module, not by family structure", async () => {
    const traits = await db.query(`SELECT tag FROM website.traits WHERE tag = 'section:downloads'`);
    expect(traits).toHaveLength(2);
    const relation = await db.query(`SELECT relation FROM website.relations`);
    expect(relation).toEqual([{ relation: "shares_module" }]);
  });

  it("links a site to the geography unit it serves", async () => {
    const rows = await db.query(`SELECT s.code FROM website.subjects x JOIN website.sites s ON s.id = x.site_id JOIN geography.units u ON u.id = x.target_id WHERE x.target_kind = 'geography.units' ORDER BY s.code`);
    expect(rows.map((row: { code: string }) => row.code)).toEqual(["ke/nairobi-county", "ke/westlands-ngcdf"]);
  });
});
