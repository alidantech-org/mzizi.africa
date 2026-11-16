import { Injectable } from "@nestjs/common";
import type { Row } from "#/database/base/read-helpers.ts";
import { GeographyPlacesRepository } from "#/modules/geography/features/places/repositories/places.repository";
import type { FeatureCollectionDto } from "#/modules/geography/schema/dto/feature-collection.dto";
import type { FeatureWindowDto } from "#/modules/geography/schema/dto/feature-window.dto";

/**
 * Browse geographic features with their names, optionally of one type or by code prefix.
 *
 * Scaffolded by Dryv once; this file belongs to the project. It runs the declared query
 * #/operations/geography.BrowseFeatures through the feature repository and maps the rows to the response;
 * add business rules around that call.
 */
@Injectable()
export class BrowseFeaturesUseCase {
  constructor(private readonly repository: GeographyPlacesRepository) {}

  async execute(input: FeatureWindowDto): Promise<FeatureCollectionDto> {
    const result = await this.repository.browseFeatures(input as unknown as Row);
    return {
      features: result,
    } as unknown as FeatureCollectionDto;
  }
}
