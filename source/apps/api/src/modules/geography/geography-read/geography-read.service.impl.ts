import { Injectable } from '@nestjs/common';
import type { GeographyEntityDto } from '#/modules/geography/dto/geography-entity.dto';
import type { GeographyFeatureResponseDto } from '#/modules/geography/dto/geography-feature-response.dto';
import type { GeographySearchQueryDto } from '#/modules/geography/dto/geography-search-query.dto';
import type { GeographySearchResponseDto } from '#/modules/geography/dto/geography-search-response.dto';
import type { GeographyBoundariesQueryDto } from '#/modules/geography/dto/geography-boundaries-query.dto';
import { GetGeographyHierarchyUseCase } from '#/modules/geography/geography-read/use-cases/get-geography-hierarchy.usecase';
import { GetGeographyHistoryUseCase } from '#/modules/geography/geography-read/use-cases/get-geography-history.usecase';
import { GetGeographyMapContextUseCase } from '#/modules/geography/geography-read/use-cases/get-geography-map-context.usecase';
import { ListBoundariesByLevelUseCase } from '#/modules/geography/geography-read/use-cases/list-boundaries-by-level.usecase';
import { GetGeoUnitByIdUseCase } from '#/modules/geography/geography-read/use-cases/get-geo-unit-by-id.usecase';
import { GetChildBoundariesUseCase } from '#/modules/geography/geography-read/use-cases/get-child-boundaries.usecase';
import { GetGeographyBoundaryUseCase } from '#/modules/geography/geography-read/use-cases/get-geography-boundary.usecase';
import { GetGeographyEntityUseCase } from '#/modules/geography/geography-read/use-cases/get-geography-entity.usecase';
import { SearchGeographyUseCase } from '#/modules/geography/geography-read/use-cases/search-geography.usecase';

/**
 * Geography Read: implements the generated GeographyGeographyReadService contract by
 * delegating to one use case per operation. The feature module binds it to that contract.
 *
 * Scaffolded by Dryv once; this file belongs to the project. New operations need a method here.
 */
@Injectable()
export class GeographyGeographyReadServiceImpl {
  constructor(
    private readonly getChildBoundariesUseCase: GetChildBoundariesUseCase,
    private readonly getGeoUnitByIdUseCase: GetGeoUnitByIdUseCase,
    private readonly getGeographyBoundaryUseCase: GetGeographyBoundaryUseCase,
    private readonly getGeographyEntityUseCase: GetGeographyEntityUseCase,
    private readonly getGeographyHierarchyUseCase: GetGeographyHierarchyUseCase,
    private readonly getGeographyHistoryUseCase: GetGeographyHistoryUseCase,
    private readonly getGeographyMapContextUseCase: GetGeographyMapContextUseCase,
    private readonly listBoundariesByLevelUseCase: ListBoundariesByLevelUseCase,
    private readonly searchGeographyUseCase: SearchGeographyUseCase,
  ) {}

  /** Ancestors and children of an entity. */
  getGeographyHierarchy(input: { entityId: string }) {
    return this.getGeographyHierarchyUseCase.execute(input);
  }

  /** Historical names and lineage of an entity. */
  getGeographyHistory(input: { entityId: string }) {
    return this.getGeographyHistoryUseCase.execute(input);
  }

  /** Parent outline and sibling boundaries for map context. */
  getGeographyMapContext(input: { entityId: string }) {
    return this.getGeographyMapContextUseCase.execute(input);
  }

  /** Verified outlines of every unit at a level within a country. */
  listBoundariesByLevel(input: GeographyBoundariesQueryDto) {
    return this.listBoundariesByLevelUseCase.execute(input);
  }

  /** Return the immediate child boundaries as GeoJSON. */
  getChildBoundaries(input: { entityId: string }) {
    return this.getChildBoundariesUseCase.execute(input);
  }

  /** Get a geography unit record with its evidence fields. */
  getGeoUnitById(input: { unitId: string }) {
    return this.getGeoUnitByIdUseCase.execute(input);
  }

  /** Return the verified geometry for an entity. */
  getGeographyBoundary(input: { entityId: string }) {
    return this.getGeographyBoundaryUseCase.execute(input);
  }

  /** Resolve a canonical geography id and its metadata. */
  getGeographyEntity(input: { entityId: string }) {
    return this.getGeographyEntityUseCase.execute(input);
  }

  /** Search administrative entities. */
  searchGeography(input: GeographySearchQueryDto) {
    return this.searchGeographyUseCase.execute(input);
  }
}