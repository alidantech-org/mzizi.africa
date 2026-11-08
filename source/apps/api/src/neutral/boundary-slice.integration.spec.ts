/// <reference types="vite/client" />
import "reflect-metadata";

import { DataSource } from "typeorm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { GetGeographyBoundaryUseCase } from "#/modules/geography/geography-read/use-cases/get-geography-boundary.usecase";
import { ListBoundariesByLevelUseCase } from "#/modules/geography/geography-read/use-cases/list-boundaries-by-level.usecase";

/**
 * Last step of the vertical slice (the archived engine/data slice test): the database
 * already holds Kenya's boundaries, imported, extracted, staged, validated, reviewed and promoted
 * by the engines. This reads them back the way GET /v1/geography/entities/{id}/boundary does.
 */
const url = process.env.SLICE_DATABASE_URL;
const entities = Object.values(
  import.meta.glob("../modules/*/entities/*.entity.ts", { eager: true }) as Record<string, Record<string, Function>>,
).flatMap((module) => Object.values(module));

describe.skipIf(!url)("boundary slice (real geoBoundaries data through every layer)", () => {
  let db: DataSource;

  beforeAll(async () => {
    db = new DataSource({ type: "postgres", url: url as string, entities, synchronize: false });
    await db.initialize();
  });

  afterAll(async () => {
    await db?.destroy();
  });

  it("serves the verified boundary of a county with its source, licence, year and version", async () => {
    const [unit] = await db.query(`SELECT id FROM geography.units WHERE code = 'ke/nairobi'`);
    const response = await new GetGeographyBoundaryUseCase(db).execute({ entityId: unit.id });
    const feature = JSON.parse(response.geojson as string);
    expect(response.boundaryVerified).toBe(true);
    expect(["Polygon", "MultiPolygon"]).toContain(feature.geometry.type);
    expect(feature.properties).toMatchObject({
      geography_id: unit.id,
      code: "ke/nairobi",
      name: "Nairobi",
      boundary_verified: true,
      boundary_year: "2020",
      boundary_version: 1,
    });
    expect(feature.properties.boundary_source).toContain("geoBoundaries");
    expect(feature.properties.boundary_license).toContain("Public Domain");
    expect(String(feature.properties.boundary_source_reference).toLowerCase()).toContain("geoboundaries");
    expect(feature.properties.boundary_retrieved_at).toMatch(/^2026-|^20\d\d-/);
  });

  it("lists all 47 verified county boundaries, each with an id and licence", async () => {
    const response = await new ListBoundariesByLevelUseCase(db).execute({ country: "ke", level: "county" } as never);
    const collection = JSON.parse(response.geojson as string);
    expect(collection.features).toHaveLength(47);
    for (const feature of collection.features) {
      expect(feature.properties.geography_id).toBeTruthy();
      expect(feature.properties.boundary_verified).toBe(true);
      expect(feature.properties.boundary_license).toContain("Public Domain");
    }
  });

  it("does not serve a boundary that is not verified", async () => {
    const [unit] = await db.query(`SELECT id FROM geography.units WHERE code = 'ke'`);
    await db.query(`UPDATE source.verifications SET state = 'under_review' WHERE target_kind = 'geography.boundaries' AND is_current AND target_id IN (SELECT id FROM geography.boundaries WHERE unit_id = $1)`, [unit.id]);
    await expect(new GetGeographyBoundaryUseCase(db).execute({ entityId: unit.id })).rejects.toThrow(/no verified boundary/);
  });
});
