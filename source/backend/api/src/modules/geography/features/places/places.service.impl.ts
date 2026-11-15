import { Injectable } from '@nestjs/common';
import type { UnitKeyDto } from '#/modules/geography/schema/dto/unit-key.dto';
import type { UnitWindowDto } from '#/modules/geography/schema/dto/unit-window.dto';
import { BrowseUnitsUseCase } from '#/modules/geography/features/places/use-cases/browse-units.usecase';
import { GetUnitUseCase } from '#/modules/geography/features/places/use-cases/get-unit.usecase';

/**
 * Places: implements the generated GeographyPlacesService contract by
 * delegating to one use case per operation. The feature module binds it to that contract.
 *
 * Scaffolded by Dryv once; this file belongs to the project. New operations need a method here.
 */
@Injectable()
export class GeographyPlacesServiceImpl {
  constructor(
    private readonly browseUnitsUseCase: BrowseUnitsUseCase,
    private readonly getUnitUseCase: GetUnitUseCase,
  ) {}

  /** Browse administrative units with their names, optionally for one country or by code prefix. */
  browseUnits(input: UnitWindowDto) {
    return this.browseUnitsUseCase.execute(input);
  }

  /** One administrative unit with its names. */
  getUnit(input: UnitKeyDto) {
    return this.getUnitUseCase.execute(input);
  }
}