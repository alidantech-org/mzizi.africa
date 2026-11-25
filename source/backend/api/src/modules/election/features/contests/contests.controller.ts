import { Controller, Get, HttpCode, Param, Query } from "@nestjs/common";

import { CountryElectionsDto } from "#/modules/election/schema/dto/country-elections.dto.ts";
import { ElectionCollectionDto } from "#/modules/election/schema/dto/election-collection.dto.ts";
import { ElectionDetailDto } from "#/modules/election/schema/dto/election-detail.dto.ts";
import { PlaceTalliesDto } from "#/modules/election/schema/dto/place-tallies.dto.ts";
import { TallyCollectionDto } from "#/modules/election/schema/dto/tally-collection.dto.ts";
import { ElectionContestsService } from "./contests.service.ts";

@Controller()
export class ElectionContestsController {
  constructor(private readonly service: ElectionContestsService) {}

  @Get("/v1/election/elections")
  @HttpCode(200)
  listElections(@Query() input: CountryElectionsDto): Promise<ElectionCollectionDto> {
    return this.service.listElections(input);
  }

  @Get("/v1/election/tallies")
  @HttpCode(200)
  listTallies(@Query() input: PlaceTalliesDto): Promise<TallyCollectionDto> {
    return this.service.listTallies(input);
  }

  @Get("/v1/election/elections/:code")
  @HttpCode(200)
  getElection(@Param("code") code: string): Promise<ElectionDetailDto> {
    return this.service.getElection({ code });
  }
}
