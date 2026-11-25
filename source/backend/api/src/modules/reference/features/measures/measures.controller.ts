import { Controller, Get, HttpCode, Query } from "@nestjs/common";
import { CurrencyCollectionDto } from "#/modules/reference/schema/dto/currency-collection.dto.ts";
import { ReferenceWindowDto } from "#/modules/reference/schema/dto/reference-window.dto.ts";
import { UnitCollectionDto } from "#/modules/reference/schema/dto/unit-collection.dto.ts";
import { ReferenceMeasuresService } from "./measures.service.ts";

@Controller()
export class ReferenceMeasuresController {
  constructor(private readonly service: ReferenceMeasuresService) {}

  @Get("/v1/reference/currencies")
  @HttpCode(200)
  listCurrencies(@Query() input: ReferenceWindowDto): Promise<CurrencyCollectionDto> {
    return this.service.listCurrencies(input);
  }

  @Get("/v1/reference/units")
  @HttpCode(200)
  listUnits(@Query() input: ReferenceWindowDto): Promise<UnitCollectionDto> {
    return this.service.listUnits(input);
  }
}
