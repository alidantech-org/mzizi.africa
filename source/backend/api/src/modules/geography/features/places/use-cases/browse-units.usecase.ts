import { Injectable } from "@nestjs/common";
import type { Row } from "#/database/base/read-helpers.ts";
import { GeographyPlacesRepository } from "#/modules/geography/features/places/repositories/places.repository";
import type { UnitCollectionDto } from "#/modules/geography/schema/dto/unit-collection.dto";
import type { UnitWindowDto } from "#/modules/geography/schema/dto/unit-window.dto";

/**
 * Browse administrative units with their names, optionally for one country or by code prefix.
 *
 * Scaffolded by Dryv once; this file belongs to the project. It runs the declared query
 * #/operations/geography.BrowseUnits through the feature repository and maps the rows to the response;
 * add business rules around that call.
 */
@Injectable()
export class BrowseUnitsUseCase {
  constructor(private readonly repository: GeographyPlacesRepository) {}

  async execute(input: UnitWindowDto): Promise<UnitCollectionDto> {
    const result = await this.repository.browseUnits(input as unknown as Row);
    return {
      units: result,
    } as unknown as UnitCollectionDto;
  }
}
