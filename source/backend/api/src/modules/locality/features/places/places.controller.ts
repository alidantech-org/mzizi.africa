import { Controller, Get, HttpCode, Param, Query } from "@nestjs/common";

import { EvidenceDetailDto } from "#/modules/locality/schema/dto/evidence-detail.dto.ts";
import { LanguageListDto } from "#/modules/locality/schema/dto/language-list.dto.ts";
import { LocalityMatchesDto } from "#/modules/locality/schema/dto/locality-matches.dto.ts";
import { LocalityProfileDto } from "#/modules/locality/schema/dto/locality-profile.dto.ts";
import { PlaceInputDto } from "#/modules/locality/schema/dto/place-input.dto.ts";
import { PositionInputDto } from "#/modules/locality/schema/dto/position-input.dto.ts";
import { SearchInputDto } from "#/modules/locality/schema/dto/search-input.dto.ts";
import { SourceCollectionDto } from "#/modules/locality/schema/dto/source-collection.dto.ts";
import { SourceSearchInputDto } from "#/modules/locality/schema/dto/source-search-input.dto.ts";
import { LocalityPlacesService } from "./places.service.ts";

@Controller()
export class LocalityPlacesController {
  constructor(private readonly service: LocalityPlacesService) {}

  @Get("/v1/sources")
  @HttpCode(200)
  browseSources(@Query() input: SourceSearchInputDto): Promise<SourceCollectionDto> {
    return this.service.browseSources(input);
  }

  @Get("/v1/languages")
  @HttpCode(200)
  listLanguages(): Promise<LanguageListDto> {
    return this.service.listLanguages();
  }

  @Get("/v1/locality/at")
  @HttpCode(200)
  resolveLocality(@Query() input: PositionInputDto): Promise<LocalityProfileDto> {
    return this.service.resolveLocality(input);
  }

  @Get("/v1/locality/search")
  @HttpCode(200)
  searchLocalities(@Query() input: SearchInputDto): Promise<LocalityMatchesDto> {
    return this.service.searchLocalities(input);
  }

  @Get("/v1/evidence/:citationId")
  @HttpCode(200)
  getEvidence(@Param("citationId") citationId: string): Promise<EvidenceDetailDto> {
    return this.service.getEvidence({ citationId });
  }

  @Get("/v1/locality/:featureId")
  @HttpCode(200)
  getLocality(
    @Param("featureId") featureId: string,
    @Query() input: PlaceInputDto,
  ): Promise<LocalityProfileDto> {
    return this.service.getLocality(input);
  }
}
