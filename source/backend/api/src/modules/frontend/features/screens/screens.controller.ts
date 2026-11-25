import { Controller, Get, HttpCode, Query } from "@nestjs/common";
import { CopyBundleDto } from "#/modules/frontend/schema/dto/copy-bundle.dto.ts";
import { CopyRequestDto } from "#/modules/frontend/schema/dto/copy-request.dto.ts";
import { HomeRequestDto } from "#/modules/frontend/schema/dto/home-request.dto.ts";
import { HomeScreenDto } from "#/modules/frontend/schema/dto/home-screen.dto.ts";
import { InstitutionRequestDto } from "#/modules/frontend/schema/dto/institution-request.dto.ts";
import { InstitutionScreenDto } from "#/modules/frontend/schema/dto/institution-screen.dto.ts";
import { PlaceRequestDto } from "#/modules/frontend/schema/dto/place-request.dto.ts";
import { PlaceScreenDto } from "#/modules/frontend/schema/dto/place-screen.dto.ts";
import { RankingRequestDto } from "#/modules/frontend/schema/dto/ranking-request.dto.ts";
import { RankingScreenDto } from "#/modules/frontend/schema/dto/ranking-screen.dto.ts";
import { SearchRequestDto } from "#/modules/frontend/schema/dto/search-request.dto.ts";
import { SearchResultsDto } from "#/modules/frontend/schema/dto/search-results.dto.ts";
import { FrontendScreensService } from "./screens.service.ts";

@Controller()
export class FrontendScreensController {
  constructor(private readonly service: FrontendScreensService) {}

  @Get("/v1/frontend/copy")
  @HttpCode(200)
  getCopyBundle(@Query() input: CopyRequestDto): Promise<CopyBundleDto> {
    return this.service.getCopyBundle(input);
  }

  @Get("/v1/frontend/home")
  @HttpCode(200)
  getHomeScreen(@Query() input: HomeRequestDto): Promise<HomeScreenDto> {
    return this.service.getHomeScreen(input);
  }

  @Get("/v1/frontend/institution")
  @HttpCode(200)
  getInstitutionScreen(@Query() input: InstitutionRequestDto): Promise<InstitutionScreenDto> {
    return this.service.getInstitutionScreen(input);
  }

  @Get("/v1/frontend/place")
  @HttpCode(200)
  getPlaceScreen(@Query() input: PlaceRequestDto): Promise<PlaceScreenDto> {
    return this.service.getPlaceScreen(input);
  }

  @Get("/v1/frontend/ranking")
  @HttpCode(200)
  getRankingScreen(@Query() input: RankingRequestDto): Promise<RankingScreenDto> {
    return this.service.getRankingScreen(input);
  }

  @Get("/v1/frontend/search")
  @HttpCode(200)
  searchScreen(@Query() input: SearchRequestDto): Promise<SearchResultsDto> {
    return this.service.searchScreen(input);
  }
}
