import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { pageWindow } from "#/database/base/read-helpers.ts";
import type { FeatureGeometryCollectionDto } from "#/modules/geography/schema/dto/feature-geometry-collection.dto";
import type { GeometryWindowDto } from "#/modules/geography/schema/dto/geometry-window.dto";
import {
  atZoom,
  currentDrawings,
  type GeometryRow,
  ofFeatureType,
  toFeatureGeometry,
  withinBounds,
} from "#/modules/geography/features/places/use-cases/geometry-reads.ts";

/** The largest page of drawings one request may return: geometries are large. */
const MAX_GEOMETRIES = 200;

/**
 * The current drawings whose envelope meets a map's bounds and whose zoom range includes the zoom, optionally of one feature type and simplified to a tolerance.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 */
@Injectable()
export class BrowseGeometriesUseCase {
  constructor(private readonly moduleRef: ModuleRef) {}

  async execute(input: GeometryWindowDto): Promise<FeatureGeometryCollectionDto> {
    const page = pageWindow(input.limit, input.offset, MAX_GEOMETRIES);
    let query = atZoom(
      withinBounds(currentDrawings(this.moduleRef, input.simplifyTolerance), input),
      input.zoom,
    );
    if (input.featureTypeId !== undefined) query = ofFeatureType(query, input.featureTypeId);
    const rows = await query.limit(page.limit).offset(page.offset).getRawMany<GeometryRow>();
    return { geometries: rows.map(toFeatureGeometry) };
  }
}
