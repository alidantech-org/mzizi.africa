import { Injectable } from "@nestjs/common";
import type { Row } from "#/database/base/read-helpers.ts";
import { GeographyPlacesRepository } from "#/modules/geography/features/places/repositories/places.repository";
import type { FeatureDetailDto } from "#/modules/geography/schema/dto/feature-detail.dto";
import type { FeatureKeyDto } from "#/modules/geography/schema/dto/feature-key.dto";

/**
 * One geographic feature with its names.
 *
 * Scaffolded by Dryv once; this file belongs to the project. It runs the declared query
 * #/operations/geography.GetFeature through the feature repository and maps the rows to the response;
 * add business rules around that call.
 */
@Injectable()
export class GetFeatureUseCase {
  constructor(private readonly repository: GeographyPlacesRepository) {}

  async execute(input: FeatureKeyDto): Promise<FeatureDetailDto> {
    const result = await this.repository.getFeature(input as unknown as Row);
    return result as unknown as FeatureDetailDto;
  }
}
