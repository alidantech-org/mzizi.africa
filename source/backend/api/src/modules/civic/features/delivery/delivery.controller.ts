import { Controller, Get, HttpCode, Param, Query } from "@nestjs/common";

import { CountryFacilitiesDto } from "#/modules/civic/schema/dto/country-facilities.dto.ts";
import { FacilityCollectionDto } from "#/modules/civic/schema/dto/facility-collection.dto.ts";
import { PlaceProjectsDto } from "#/modules/civic/schema/dto/place-projects.dto.ts";
import { ProjectCollectionDto } from "#/modules/civic/schema/dto/project-collection.dto.ts";
import { ProjectDetailDto } from "#/modules/civic/schema/dto/project-detail.dto.ts";
import { CivicDeliveryService } from "./delivery.service.ts";

@Controller()
export class CivicDeliveryController {
  constructor(private readonly service: CivicDeliveryService) {}

  @Get("/v1/civic/facilities")
  @HttpCode(200)
  listFacilities(@Query() input: CountryFacilitiesDto): Promise<FacilityCollectionDto> {
    return this.service.listFacilities(input);
  }

  @Get("/v1/civic/projects")
  @HttpCode(200)
  listPlaceProjects(@Query() input: PlaceProjectsDto): Promise<ProjectCollectionDto> {
    return this.service.listPlaceProjects(input);
  }

  @Get("/v1/civic/projects/:code")
  @HttpCode(200)
  getProject(@Param("code") code: string): Promise<ProjectDetailDto> {
    return this.service.getProject({ code });
  }
}
