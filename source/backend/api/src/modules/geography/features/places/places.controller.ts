import { Controller, Get, HttpCode, Param, Query } from "@nestjs/common";

import { ChildCollectionDto } from "#/modules/geography/schema/dto/child-collection.dto.ts";
import { ChildWindowDto } from "#/modules/geography/schema/dto/child-window.dto.ts";
import { FeatureWindowDto } from "#/modules/geography/schema/dto/feature-window.dto.ts";
import { PlaceAtPointDto } from "#/modules/geography/schema/dto/place-at-point.dto.ts";
import { PlaceCollectionDto } from "#/modules/geography/schema/dto/place-collection.dto.ts";
import { PlaceDetailDto } from "#/modules/geography/schema/dto/place-detail.dto.ts";
import { PointQueryDto } from "#/modules/geography/schema/dto/point-query.dto.ts";
import { GeographyPlacesService } from "./places.service.ts";

@Controller()
export class GeographyPlacesController {
  constructor(private readonly service: GeographyPlacesService) {}

  @Get("/v1/geography/at")
  @HttpCode(200)
  findPlacesAtPoint(@Query() input: PointQueryDto): Promise<PlaceAtPointDto> {
    return this.service.findPlacesAtPoint(input);
  }

  @Get("/v1/geography/children")
  @HttpCode(200)
  listChildren(@Query() input: ChildWindowDto): Promise<ChildCollectionDto> {
    return this.service.listChildren(input);
  }

  @Get("/v1/geography/places")
  @HttpCode(200)
  listPlaces(@Query() input: FeatureWindowDto): Promise<PlaceCollectionDto> {
    return this.service.listPlaces(input);
  }

  @Get("/v1/geography/places/:code")
  @HttpCode(200)
  getPlace(@Param("code") code: string): Promise<PlaceDetailDto> {
    return this.service.getPlace({ code });
  }
}
