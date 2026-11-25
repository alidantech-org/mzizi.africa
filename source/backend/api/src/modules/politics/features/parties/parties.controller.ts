import { Controller, Get, HttpCode, Param, Query } from "@nestjs/common";

import { CountryPartiesDto } from "#/modules/politics/schema/dto/country-parties.dto.ts";
import { PartyCollectionDto } from "#/modules/politics/schema/dto/party-collection.dto.ts";
import { PartyDetailDto } from "#/modules/politics/schema/dto/party-detail.dto.ts";
import { PoliticsPartiesService } from "./parties.service.ts";

@Controller()
export class PoliticsPartiesController {
  constructor(private readonly service: PoliticsPartiesService) {}

  @Get("/v1/politics/parties")
  @HttpCode(200)
  listParties(@Query() input: CountryPartiesDto): Promise<PartyCollectionDto> {
    return this.service.listParties(input);
  }

  @Get("/v1/politics/parties/:code")
  @HttpCode(200)
  getParty(@Param("code") code: string): Promise<PartyDetailDto> {
    return this.service.getParty({ code });
  }
}
