/**
 * Reads of current feature drawings for the geometry operations. Hand-written: a Dryv read query has no spatial
 * predicate yet, so these build the query on the generated GeometriesRepository, entity and DTO types and use
 * PostGIS for the bounds, the zoom range and the optional simplification.
 */
import type { ModuleRef } from "@nestjs/core";
import { getDataSourceToken } from "@nestjs/typeorm";
import type { DataSource, SelectQueryBuilder } from "typeorm";
import { FeaturesEntity } from "#/modules/geography/schema/entities/features.entity.ts";
import { GeometriesEntity } from "#/modules/geography/schema/entities/geometries.entity.ts";
import type { FeatureGeometryDto } from "#/modules/geography/schema/dto/feature-geometry.dto.ts";
import { GeometriesRepository } from "#/modules/geography/schema/repositories/geometries.repository.ts";

/** One selected row: the drawing's evidence columns and its geometry already encoded as GeoJSON. */
export interface GeometryRow {
  geometryId: string;
  featureId: string;
  geometryRoleId: string;
  basisId: string;
  revision: number;
  confidence: number | null;
  minZoom: number | null;
  maxZoom: number | null;
  geometry: unknown;
  centroid: unknown;
  validFrom: Date;
  observedAt: Date | null;
}

/** The SRID every stored drawing and every bounds value uses. */
export const GEOMETRY_SRID = 4326;

/** A query over the current drawings (no end of validity) selecting the evidence columns and GeoJSON geometry. */
export function currentDrawings(
  moduleRef: ModuleRef,
  simplifyTolerance: number | undefined,
): SelectQueryBuilder<GeometriesEntity> {
  const dataSource = moduleRef.get<DataSource>(getDataSourceToken(), { strict: false });
  const repository = new GeometriesRepository(dataSource.getRepository(GeometriesEntity));
  const geometry =
    simplifyTolerance === undefined || simplifyTolerance === 0
      ? "g.geometry"
      : "ST_SimplifyPreserveTopology(g.geometry, :tolerance)";
  const query = repository
    .query("g")
    .select([])
    .where("g.validUntil IS NULL")
    .andWhere("g.deletedAt IS NULL");
  if (simplifyTolerance) query.setParameter("tolerance", simplifyTolerance);
  return query
    .addSelect("g.id", "geometryId")
    .addSelect("g.featureId", "featureId")
    .addSelect("g.geometryRoleId", "geometryRoleId")
    .addSelect("g.basisId", "basisId")
    .addSelect("g.revision", "revision")
    .addSelect("g.confidence", "confidence")
    .addSelect("g.minZoom", "minZoom")
    .addSelect("g.maxZoom", "maxZoom")
    .addSelect(`ST_AsGeoJSON(${geometry})::json`, "geometry")
    .addSelect("ST_AsGeoJSON(g.centroid)::json", "centroid")
    .addSelect("g.validFrom", "validFrom")
    .addSelect("g.observedAt", "observedAt")
    .orderBy("g.featureId", "ASC")
    .addOrderBy("g.geometryRoleId", "ASC")
    .addOrderBy("g.revision", "DESC");
}

/** Restrict a drawing query to features of one type. */
export function ofFeatureType(
  query: SelectQueryBuilder<GeometriesEntity>,
  featureTypeId: string,
): SelectQueryBuilder<GeometriesEntity> {
  return query
    .innerJoin(FeaturesEntity, "f", "f.id = g.featureId")
    .andWhere("f.featureTypeId = :featureTypeId", { featureTypeId });
}

/** The drawings whose envelope meets the bounds. */
export function withinBounds(
  query: SelectQueryBuilder<GeometriesEntity>,
  bounds: { west: number; south: number; east: number; north: number },
): SelectQueryBuilder<GeometriesEntity> {
  return query.andWhere(
    `g.envelope && ST_MakeEnvelope(:west, :south, :east, :north, ${GEOMETRY_SRID})`,
    bounds,
  );
}

/** The drawings meant for this zoom: no recorded range means every zoom. */
export function atZoom(
  query: SelectQueryBuilder<GeometriesEntity>,
  zoom: number,
): SelectQueryBuilder<GeometriesEntity> {
  return query
    .andWhere("(g.minZoom IS NULL OR g.minZoom <= :zoom)", { zoom })
    .andWhere("(g.maxZoom IS NULL OR g.maxZoom >= :zoom)");
}

/** The response shape of one row; timestamps leave as ISO-8601 instants. */
export function toFeatureGeometry(row: GeometryRow): FeatureGeometryDto {
  return {
    geometryId: row.geometryId,
    featureId: row.featureId,
    geometryRoleId: row.geometryRoleId,
    basisId: row.basisId,
    revision: Number(row.revision),
    confidence: row.confidence === null ? null : Number(row.confidence),
    minZoom: row.minZoom,
    maxZoom: row.maxZoom,
    geometry: row.geometry,
    centroid: row.centroid,
    validFrom: row.validFrom.toISOString(),
    observedAt: row.observedAt === null ? null : row.observedAt.toISOString(),
  };
}
