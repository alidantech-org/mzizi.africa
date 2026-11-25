import { Controller, Get, HttpCode, Param, Query } from "@nestjs/common";

import { CountryCollectionDto } from "#/modules/reference/schema/dto/country-collection.dto.ts";
import { CountryDetailDto } from "#/modules/reference/schema/dto/country-detail.dto.ts";
import { ReferenceWindowDto } from "#/modules/reference/schema/dto/reference-window.dto.ts";
import { ReferenceCountriesService } from "./countries.service.ts";

@Controller()
export class ReferenceCountriesController {
  constructor(private readonly service: ReferenceCountriesService) {}

  @Get("/v1/reference/countries")
  @HttpCode(200)
  listCountries(@Query() input: ReferenceWindowDto): Promise<CountryCollectionDto> {
    return this.service.listCountries(input);
  }

  @Get("/v1/reference/countries/:code")
  @HttpCode(200)
  getCountry(@Param("code") code: string): Promise<CountryDetailDto> {
    return this.service.getCountry({ code });
  }
}
