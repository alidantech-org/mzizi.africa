import { Controller, Get, HttpCode, Param, Query } from "@nestjs/common";

import { SchemeDetailDto } from "#/modules/vocabulary/schema/dto/scheme-detail.dto.ts";
import { TermCollectionDto } from "#/modules/vocabulary/schema/dto/term-collection.dto.ts";
import { TermWindowDto } from "#/modules/vocabulary/schema/dto/term-window.dto.ts";
import { VocabularyTermsService } from "./terms.service.ts";

@Controller()
export class VocabularyTermsController {
  constructor(private readonly service: VocabularyTermsService) {}

  @Get("/v1/vocabulary/terms")
  @HttpCode(200)
  listTerms(@Query() input: TermWindowDto): Promise<TermCollectionDto> {
    return this.service.listTerms(input);
  }

  @Get("/v1/vocabulary/schemes/:code")
  @HttpCode(200)
  getScheme(@Param("code") code: string): Promise<SchemeDetailDto> {
    return this.service.getScheme({ code });
  }
}
