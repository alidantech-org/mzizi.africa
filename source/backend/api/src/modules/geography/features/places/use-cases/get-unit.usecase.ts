import { Injectable } from "@nestjs/common";
import type { Row } from "#/database/base/read-helpers.ts";
import { GeographyPlacesRepository } from "#/modules/geography/features/places/repositories/places.repository";
import type { UnitDetailDto } from "#/modules/geography/schema/dto/unit-detail.dto";
import type { UnitKeyDto } from "#/modules/geography/schema/dto/unit-key.dto";

/**
 * One administrative unit with its names.
 *
 * Scaffolded by Dryv once; this file belongs to the project. It runs the declared query
 * #/operations/geography.GetUnit through the feature repository and maps the rows to the response;
 * add business rules around that call.
 */
@Injectable()
export class GetUnitUseCase {
  constructor(private readonly repository: GeographyPlacesRepository) {}

  async execute(input: UnitKeyDto): Promise<UnitDetailDto> {
    const result = await this.repository.getUnit(input as unknown as Row);
    return result as unknown as UnitDetailDto;
  }
}
