/** Simplified outlines to draw a map. Kept in its own module; the use case imports it once the generated types exist. */
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import type { DataSource } from "typeorm";
import type { BoundariesInputDto } from "#/modules/explorer/schema/dto/boundaries-input.dto";
import { BoundariesDto } from "#/modules/explorer/schema/dto/boundaries.dto";
import { BoundaryShapeDto } from "#/modules/explorer/schema/dto/boundary-shape.dto";
import { asPlace, country, language, segmentsOf } from "./explorer.ts";
import { atPath, insideOf, registry } from "./registry.ts";
import { latestBaseline, POPULATION } from "#/modules/insights/features/insights/reads/shared.ts";

/** Simplified outlines to draw a map: the places inside a place (or the place itself), from the recorded geometries. */
export async function boundaries(db: DataSource, input: BoundariesInputDto): Promise<BoundariesDto> {
  const selected = await country(db, input.countryCode);
  const lang = await language(db, input.languageCode);
  const rows = await registry(db, selected.id, lang);
  const place = atPath(rows, segmentsOf(input.path));
  if (!place) throw new NotFoundException("This place has no current registered path in the selected country.");
  const self = input.mode === "self";
  const wanted = self ? [place] : insideOf(rows, place);
  const limit = Math.min(input.limit ?? 500, 1500);
  const chosen = wanted.slice(0, limit);
  // Coarse outlines for a country-wide map, finer ones the smaller the place: a tenth of a degree is about 11 km.
  const tolerance = input.simplify ?? (place.depth === 0 ? 0.01 : place.depth === 1 ? 0.003 : 0.0008);
  const raw: unknown = chosen.length
    ? await db.query(
        `select distinct on (g.feature_id) g.feature_id as "featureId",
           ST_AsGeoJSON(ST_SimplifyPreserveTopology(g.geometry,$2),5) as "geometry",
           ST_XMin(g.geometry)::float as "west",ST_YMin(g.geometry)::float as "south",ST_XMax(g.geometry)::float as "east",ST_YMax(g.geometry)::float as "north",
           ${latestBaseline(POPULATION, "g.feature_id")}::float as "population"
         from geography.geometries g
         join reference.values role on role.id=g.geometry_role_id and role.code='ref.val.geo.geometry.role.outline'
        where g.feature_id=any($1::uuid[]) and g.deleted_at is null and g.geometry is not null
          and ST_GeometryType(g.geometry) in ('ST_Polygon','ST_MultiPolygon')
        order by g.feature_id,g.revision desc`,
        [chosen.map((p) => p.featureId), tolerance],
      )
    : [];
  if (!Array.isArray(raw)) throw new InternalServerErrorException("The boundaries read did not return rows.");
  const byFeature = new Map<string, Record<string, unknown>>();
  for (const r of raw as Record<string, unknown>[]) byFeature.set(String(r.featureId), r);
  const num = (v: unknown) => (typeof v === "number" ? v : Number(v));
  const shapes = chosen.flatMap((p) => {
    const r = byFeature.get(p.featureId);
    if (!r || typeof r.geometry !== "string") return [];
    return [
      Object.assign(new BoundaryShapeDto(), {
        address: p.canonicalPath,
        name: p.name,
        kind: p.kind,
        kindCode: p.kindCode,
        geometry: r.geometry,
        bbox: [num(r.west), num(r.south), num(r.east), num(r.north)],
        population: r.population === null || r.population === undefined ? null : num(r.population),
        childCount: insideOf(rows, p).length,
      }),
    ];
  });
  const box = shapes.length
    ? [
        Math.min(...shapes.map((x) => x.bbox[0]!)),
        Math.min(...shapes.map((x) => x.bbox[1]!)),
        Math.max(...shapes.map((x) => x.bbox[2]!)),
        Math.max(...shapes.map((x) => x.bbox[3]!)),
      ]
    : [];
  const gaps = wanted.length > chosen.length ? [`Only the first ${chosen.length} of ${wanted.length} places are drawn.`] : [];
  return Object.assign(new BoundariesDto(), {
    place: asPlace(place),
    shapes,
    bbox: box,
    withoutBoundary: chosen.length - shapes.length,
    gaps,
  });
}
