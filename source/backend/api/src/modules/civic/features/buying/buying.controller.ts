import { Controller, Get, HttpCode, Param, Query } from "@nestjs/common";

import { CountryTendersDto } from "#/modules/civic/schema/dto/country-tenders.dto.ts";
import { TenderCollectionDto } from "#/modules/civic/schema/dto/tender-collection.dto.ts";
import { TenderDetailDto } from "#/modules/civic/schema/dto/tender-detail.dto.ts";
import { CivicBuyingService } from "./buying.service.ts";

@Controller()
export class CivicBuyingController {
  constructor(private readonly service: CivicBuyingService) {}

  @Get("/v1/civic/tenders")
  @HttpCode(200)
  listTenders(@Query() input: CountryTendersDto): Promise<TenderCollectionDto> {
    return this.service.listTenders(input);
  }

  @Get("/v1/civic/tenders/:code")
  @HttpCode(200)
  getTender(@Param("code") code: string): Promise<TenderDetailDto> {
    return this.service.getTender({ code });
  }
}
