/// <reference types="vite/client" />
import "reflect-metadata";

import { NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { GetChildBoundariesUseCase } from "#/modules/geography/geography-read/use-cases/get-child-boundaries.usecase";
import { GetGeographyBoundaryUseCase } from "#/modules/geography/geography-read/use-cases/get-geography-boundary.usecase";
import { GetGeographyEntityUseCase } from "#/modules/geography/geography-read/use-cases/get-geography-entity.usecase";
import { SearchGeographyUseCase } from "#/modules/geography/geography-read/use-cases/search-geography.usecase";

/**
 * Project-owned integration test against a real PostgreSQL (PostGIS image). Set TEST_DATABASE_URL
 * to an admin connection of a scratch database, for example
 * postgres://postgres:test@localhost:55432/mzizi. The test creates the schema itself with
 * synchronize: that is test setup only; the API never owns schema. All reads then run through a
 * SELECT-only role, which proves the read slice needs nothing more.
 */
const entities = Object.values(
  import.meta.glob("../../*/entities/*.entity.ts", { eager: true }) as Record<string, Record<string, Function>>,
).flatMap((module) => Object.values(module));

const adminUrl = process.env.TEST_DATABASE_URL;
const READER = "mzizi_api_reader_test";

describe.skipIf(!adminUrl)("geography read slice (PostgreSQL)", () => {
  let admin: DataSource;
  let reader: DataSource;
  const ids = {
    ke: "11111111-1111-4111-8111-111111111111",
    polity: "11111111-1111-4111-8111-111111111112",
    lvlPolity: "22222222-2222-4222-8222-222222222223",
    lvlCountry: "22222222-2222-4222-8222-222222222221",
    lvlCounty: "22222222-2222-4222-8222-222222222222",
    kenya: "33333333-3333-4333-8333-333333333331",
    nairobi: "33333333-3333-4333-8333-333333333332",
    kisumu: "33333333-3333-4333-8333-333333333333",
    bNairobi: "44444444-4444-4444-8444-444444444441",
    bKisumu: "44444444-4444-4444-8444-444444444442",
    kingdom: "33333333-3333-4333-8333-333333333334",
  };
  const polygon = { type: "Polygon", coordinates: [[[36.6, -1.4], [37.1, -1.4], [37.1, -1.1], [36.6, -1.1], [36.6, -1.4]]] };

  beforeAll(async () => {
    admin = new DataSource({
      type: "postgres",
      url: adminUrl,
      entities,
      synchronize: true,
      dropSchema: true,
    });
    await admin.initialize();
    const evidence = `source_name, method, verification_state, is_current, version, created_at, updated_at`;
    const ev = (state: string) => `'Test source', 'curated', '${state}', true, 1, now(), now()`;
    await admin.query(
      `INSERT INTO jurisdictions (id, code, name, kind, ${evidence}) VALUES ($1, 'ke', 'Kenya', 'modern_state', ${ev("verified")})`,
      [ids.ke],
    );
    await admin.query(
      `INSERT INTO jurisdictions (id, code, name, kind, ${evidence}) VALUES ($1, 'kingdom-of-example', 'Kingdom of Example', 'historical_polity', ${ev("disputed")})`,
      [ids.polity],
    );
    await admin.query(
      `INSERT INTO classification_records (id, jurisdiction_id, scheme, code, label, "order", ${evidence}) VALUES ($1, $2, 'geography/level', 'geography/realm', 'realm', 0, ${ev("disputed")})`,
      [ids.lvlPolity, ids.polity],
    );
    for (const [id, code, label, order] of [
      [ids.lvlCountry, "geography/country", "country", 0],
      [ids.lvlCounty, "geography/county", "county", 1],
    ] as const) {
      await admin.query(
        `INSERT INTO classification_records (id, jurisdiction_id, scheme, code, label, "order", ${evidence}) VALUES ($1, $2, 'geography/level', $3, $4, $5, ${ev("verified")})`,
        [id, ids.ke, code, label, order],
      );
    }
    const unit = (id: string, code: string, name: string, level: string, parent: string | null, kind = "territorial", jurisdiction = ids.ke) =>
      admin.query(
        `INSERT INTO geo_units (id, code, name, kind, jurisdiction_id, level_id, parent_id, is_active, ${evidence}) VALUES ($1,$2,$3,$4,$5,$6,$7,true, ${ev("verified")})`,
        [id, code, name, kind, jurisdiction, level, parent],
      );
    await unit(ids.kenya, "ke", "Kenya", ids.lvlCountry, null);
    await unit(ids.nairobi, "ke/nairobi", "Nairobi", ids.lvlCounty, ids.kenya);
    await unit(ids.kisumu, "ke/kisumu", "Kisumu", ids.lvlCounty, ids.kenya);
    await unit(ids.kingdom, "kingdom-of-example", "Kingdom of Example", ids.lvlPolity, null, "historical_polity", ids.polity);
    const boundary = (id: string, unitId: string, state: string) =>
      admin.query(
        `INSERT INTO geo_boundary_versions (id, unit_id, version_number, geometry, source_name, licence, retrieved_at, method, verification_state, is_current, version, created_at, updated_at)
         VALUES ($1, $2, 1, $3, 'Test survey', 'CC-BY-4.0', now(), 'curated', $4, true, 1, now(), now())`,
        [id, unitId, JSON.stringify(polygon), state],
      );
    await boundary(ids.bNairobi, ids.nairobi, "verified");
    await boundary(ids.bKisumu, ids.kisumu, "unverified");

    await admin.query(
      `DO $$ BEGIN IF EXISTS (SELECT FROM pg_roles WHERE rolname = '${READER}') THEN DROP OWNED BY ${READER}; DROP ROLE ${READER}; END IF; END $$`,
    );
    await admin.query(`CREATE ROLE ${READER} LOGIN PASSWORD 'reader'`);
    await admin.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO ${READER}`);
    const url = new URL(adminUrl as string);
    url.username = READER;
    url.password = "reader";
    reader = new DataSource({ type: "postgres", url: url.toString() });
    await reader.initialize();
  });

  afterAll(async () => {
    await reader?.destroy();
    await admin?.destroy();
  });

  it("searches by name within a jurisdiction", async () => {
    const result = await new SearchGeographyUseCase(reader).execute({ q: "nai", country: "KE" } as never);
    expect(result.results.map((entity) => entity.code)).toEqual(["ke/nairobi"]);
  });

  it("represents a historical polity under its own jurisdiction, not a modern state", async () => {
    const found = await new SearchGeographyUseCase(reader).execute({ q: "kingdom", country: "kingdom-of-example" } as never);
    expect(found.results.map((entity) => [entity.code, entity.level])).toEqual([["kingdom-of-example", "realm"]]);
  });

  it("does not return units of other jurisdictions", async () => {
    const result = await new SearchGeographyUseCase(reader).execute({ q: "kingdom", country: "ke" } as never);
    expect(result.results).toEqual([]);
  });

  it("resolves an entity with level, parent and boundary provenance", async () => {
    const entity = await new GetGeographyEntityUseCase(reader).execute({ entityId: ids.nairobi });
    expect(entity).toMatchObject({
      code: "ke/nairobi",
      level: "county",
      parentName: "Kenya",
      boundaryVerified: true,
      boundarySource: "Test survey",
      boundaryLicense: "CC-BY-4.0",
    });
  });

  it("answers 404 for an unknown entity", async () => {
    await expect(
      new GetGeographyEntityUseCase(reader).execute({ entityId: "99999999-9999-4999-8999-999999999999" }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("serves only verified boundaries", async () => {
    const verified = await new GetGeographyBoundaryUseCase(reader).execute({ entityId: ids.nairobi });
    expect(JSON.parse(verified.geojson).geometry.type).toBe("Polygon");
    await expect(new GetGeographyBoundaryUseCase(reader).execute({ entityId: ids.kisumu })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("returns child boundaries as a FeatureCollection of verified children only", async () => {
    const children = await new GetChildBoundariesUseCase(reader).execute({ entityId: ids.kenya });
    const collection = JSON.parse(children.geojson);
    expect(collection.type).toBe("FeatureCollection");
    expect(collection.features.map((feature: { properties: { code: string } }) => feature.properties.code)).toEqual(["ke/nairobi"]);
  });

  it("cannot write with the read-only role", async () => {
    await expect(reader.query(`UPDATE geo_units SET name = 'x'`)).rejects.toThrow(/permission denied/);
  });
});
