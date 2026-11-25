import { Controller, Get, HttpCode, Param, Query } from "@nestjs/common";

import { AddressKeyDto } from "#/modules/identity/schema/dto/address-key.dto.ts";
import { AddressMatchesDto } from "#/modules/identity/schema/dto/address-matches.dto.ts";
import { IdentityDetailDto } from "#/modules/identity/schema/dto/identity-detail.dto.ts";
import { NameMatchesDto } from "#/modules/identity/schema/dto/name-matches.dto.ts";
import { NameSearchDto } from "#/modules/identity/schema/dto/name-search.dto.ts";
import { IdentityThingsService } from "./things.service.ts";

@Controller()
export class IdentityThingsController {
  constructor(private readonly service: IdentityThingsService) {}

  @Get("/v1/identity/addresses")
  @HttpCode(200)
  resolveAddress(@Query() input: AddressKeyDto): Promise<AddressMatchesDto> {
    return this.service.resolveAddress(input);
  }

  @Get("/v1/identity/search")
  @HttpCode(200)
  searchNames(@Query() input: NameSearchDto): Promise<NameMatchesDto> {
    return this.service.searchNames(input);
  }

  @Get("/v1/identity/things/:code")
  @HttpCode(200)
  getIdentity(@Param("code") code: string): Promise<IdentityDetailDto> {
    return this.service.getIdentity({ code });
  }
}
