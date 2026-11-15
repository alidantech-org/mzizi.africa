import {
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from "@nestjs/common";

import { UnitCollectionDto } from "#/modules/geography/dto/unit-collection.dto.ts";
import { UnitDetailDto } from "#/modules/geography/dto/unit-detail.dto.ts";
import { UnitWindowDto } from "#/modules/geography/dto/unit-window.dto.ts";
import { GeographyPlacesService } from "./places.service.ts";

@Controller()
export class GeographyPlacesController {
  constructor(private readonly service: GeographyPlacesService) {}


  @Get("/v1/geography/units")
  @HttpCode(200)
  browseUnits(
    @Query() input: UnitWindowDto,
  ): Promise<UnitCollectionDto> {
    return this.service.browseUnits(input);
  }


  @Get("/v1/geography/units/:featureId")
  @HttpCode(200)
  getUnit(
    @Param("featureId") featureId: string,
  ): Promise<UnitDetailDto> {
    return this.service.getUnit({ featureId });
  }
}