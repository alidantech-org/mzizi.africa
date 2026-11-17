import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import type { FeatureGeometryCollectionDto } from "#/modules/geography/schema/dto/feature-geometry-collection.dto";
import type { FeatureKeyDto } from "#/modules/geography/schema/dto/feature-key.dto";
import {
  currentDrawings,
  type GeometryRow,
  toFeatureGeometry,
} from "#/modules/geography/features/places/use-cases/geometry-reads.ts";

/**
 * The current drawings of one feature, each with its role, basis, revision, confidence, zoom range and validity. A feature with no drawing returns an empty list.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 */
@Injectable()
export class ListFeatureGeometriesUseCase {
  constructor(private readonly moduleRef: ModuleRef) {}

  async execute(input: FeatureKeyDto): Promise<FeatureGeometryCollectionDto> {
    const rows = await currentDrawings(this.moduleRef, undefined)
      .andWhere("g.featureId = :featureId", { featureId: input.featureId })
      .getRawMany<GeometryRow>();
    return { geometries: rows.map(toFeatureGeometry) };
  }
}
