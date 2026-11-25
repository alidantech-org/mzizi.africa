import { Controller, Get, HttpCode, Query } from "@nestjs/common";
import { CountryTimelineDto } from "#/modules/history/schema/dto/country-timeline.dto.ts";
import { EraCollectionDto } from "#/modules/history/schema/dto/era-collection.dto.ts";
import { HistoryCollectionDto } from "#/modules/history/schema/dto/history-collection.dto.ts";
import { HistoryTimelineService } from "./timeline.service.ts";

@Controller()
export class HistoryTimelineController {
  constructor(private readonly service: HistoryTimelineService) {}

  @Get("/v1/history/eras")
  @HttpCode(200)
  listEras(@Query() input: CountryTimelineDto): Promise<EraCollectionDto> {
    return this.service.listEras(input);
  }

  @Get("/v1/history/occurrences")
  @HttpCode(200)
  listHistory(@Query() input: CountryTimelineDto): Promise<HistoryCollectionDto> {
    return this.service.listHistory(input);
  }
}
