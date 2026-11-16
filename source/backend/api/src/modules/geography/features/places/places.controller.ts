import { Controller, Get, HttpCode, Param, Query } from "@nestjs/common";

import { FeatureCollectionDto } from "#/modules/geography/schema/dto/feature-collection.dto.ts";
import { FeatureDetailDto } from "#/modules/geography/schema/dto/feature-detail.dto.ts";
import { FeatureWindowDto } from "#/modules/geography/schema/dto/feature-window.dto.ts";
import { GeographyPlacesService } from "./places.service.ts";

@Controller()
export class GeographyPlacesController {
  constructor(private readonly service: GeographyPlacesService) {}

  @Get("/v1/geography/features")
  @HttpCode(200)
  browseFeatures(@Query() input: FeatureWindowDto): Promise<FeatureCollectionDto> {
    return this.service.browseFeatures(input);
  }

  @Get("/v1/geography/features/:featureId")
  @HttpCode(200)
  getFeature(@Param("featureId") featureId: string): Promise<FeatureDetailDto> {
    return this.service.getFeature({ featureId });
  }
}
