import { Controller, Get, HttpCode, Query } from "@nestjs/common";
import { LanguageCollectionDto } from "#/modules/reference/schema/dto/language-collection.dto.ts";
import { ReferenceWindowDto } from "#/modules/reference/schema/dto/reference-window.dto.ts";
import { ReferenceLanguagesService } from "./languages.service.ts";

@Controller()
export class ReferenceLanguagesController {
  constructor(private readonly service: ReferenceLanguagesService) {}

  @Get("/v1/reference/languages")
  @HttpCode(200)
  listLanguages(@Query() input: ReferenceWindowDto): Promise<LanguageCollectionDto> {
    return this.service.listLanguages(input);
  }
}
