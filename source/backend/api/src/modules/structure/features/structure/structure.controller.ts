import { Controller, Get, HttpCode, Query } from "@nestjs/common";
import { CountryContextDocumentDto } from "#/modules/structure/schema/dto/country-context-document.dto.ts";
import { StructureDocumentDto } from "#/modules/structure/schema/dto/structure-document.dto.ts";
import { StructureInputDto } from "#/modules/structure/schema/dto/structure-input.dto.ts";
import { StructureStructureService } from "./structure.service.ts";

@Controller()
export class StructureStructureController {
  constructor(private readonly service: StructureStructureService) {}

  @Get("/v1/structure/context")
  @HttpCode(200)
  getCountryContext(@Query() input: StructureInputDto): Promise<CountryContextDocumentDto> {
    return this.service.getCountryContext(input);
  }

  @Get("/v1/structure")
  @HttpCode(200)
  getStructureScreen(@Query() input: StructureInputDto): Promise<StructureDocumentDto> {
    return this.service.getStructureScreen(input);
  }
}
