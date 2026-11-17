/// <reference types="vite/client" />
import { getDataSourceToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { describe, expect, it } from "vitest";

import {
  atZoom,
  currentDrawings,
  ofFeatureType,
  withinBounds,
} from "#/modules/geography/features/places/use-cases/geometry-reads.ts";

/**
 * The geometry reads build SQL on the generated repository. This builds the statements against the entity
 * metadata without a database connection and checks the PostGIS predicates, the zoom range and the optional
 * simplification. It does not execute them: no database with the geometries table was available.
 */
type EntityClass = new () => object;

async function moduleRefWithMetadata() {
  const modules = import.meta.glob<Record<string, EntityClass>>("/src/modules/**/*.entity.ts", {
    eager: true,
  });
  const entities = Object.values(modules).flatMap((module) => Object.values(module));
  const dataSource = new DataSource({ type: "postgres", entities });
  // Builds the entity metadata without opening a connection; TypeORM marks it protected.
  await (dataSource as unknown as { buildMetadatas(): Promise<void> }).buildMetadatas();
  return {
    get: (token: unknown) => {
      if (token === getDataSourceToken()) return dataSource;
      throw new Error("unexpected token");
    },
  } as never;
}

describe("geometry reads", () => {
  it("selects current drawings with their evidence and GeoJSON geometry", async () => {
    const sql = currentDrawings(await moduleRefWithMetadata(), undefined).getQuery();
    expect(sql).toContain("ST_AsGeoJSON(");
    expect(sql).toContain('"g"."valid_until" IS NULL');
    expect(sql).toContain('"g"."deleted_at" IS NULL');
    expect(sql).toContain('"geometryId"');
  });

  it("applies the bounds, zoom range, feature type and tolerance", async () => {
    const ref = await moduleRefWithMetadata();
    const query = ofFeatureType(
      atZoom(
        withinBounds(currentDrawings(ref, 0.01), { west: 34, south: -5, east: 42, north: 5 }),
        6,
      ),
      "type-1",
    );
    const sql = query.getQuery();
    expect(sql).toContain("ST_MakeEnvelope(");
    expect(sql).toContain("ST_SimplifyPreserveTopology(");
    expect(sql).toContain('("g"."min_zoom" IS NULL OR "g"."min_zoom" <= :zoom)');
    expect(sql).toContain('"g"."envelope" && ST_MakeEnvelope(');
    expect(sql).toContain('"f"."feature_type_id" = :featureTypeId');
  });
});
