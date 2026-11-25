import { Controller, Get, HttpCode, Param, Query } from "@nestjs/common";

import { OfficeCollectionDto } from "#/modules/governance/schema/dto/office-collection.dto.ts";
import { OfficeDetailDto } from "#/modules/governance/schema/dto/office-detail.dto.ts";
import { PlaceOfficesDto } from "#/modules/governance/schema/dto/place-offices.dto.ts";
import { GovernanceSeatsService } from "./seats.service.ts";

@Controller()
export class GovernanceSeatsController {
  constructor(private readonly service: GovernanceSeatsService) {}

  @Get("/v1/governance/offices")
  @HttpCode(200)
  listPlaceOffices(@Query() input: PlaceOfficesDto): Promise<OfficeCollectionDto> {
    return this.service.listPlaceOffices(input);
  }

  @Get("/v1/governance/offices/:code")
  @HttpCode(200)
  getOffice(@Param("code") code: string): Promise<OfficeDetailDto> {
    return this.service.getOffice({ code });
  }
}
