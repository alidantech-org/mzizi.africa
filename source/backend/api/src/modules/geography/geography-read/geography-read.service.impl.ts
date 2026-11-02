import { Injectable } from '@nestjs/common';
import type { GeographyEntityDto } from '#/modules/geography/dto/geography-entity.dto';
import type { GeographyFeatureResponseDto } from '#/modules/geography/dto/geography-feature-response.dto';
import type { GeographySearchQueryDto } from '#/modules/geography/dto/geography-search-query.dto';
import type { GeographySearchResponseDto } from '#/modules/geography/dto/geography-search-response.dto';
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
    private readonly searchGeographyUseCase: SearchGeographyUseCase,
  ) {}

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