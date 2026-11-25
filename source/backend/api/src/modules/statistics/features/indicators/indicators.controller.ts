import { Controller, Get, HttpCode, Param, Query } from "@nestjs/common";

import { IndicatorCollectionDto } from "#/modules/statistics/schema/dto/indicator-collection.dto.ts";
import { IndicatorDetailDto } from "#/modules/statistics/schema/dto/indicator-detail.dto.ts";
import { IndicatorWindowDto } from "#/modules/statistics/schema/dto/indicator-window.dto.ts";
import { StatisticsIndicatorsService } from "./indicators.service.ts";

@Controller()
export class StatisticsIndicatorsController {
  constructor(private readonly service: StatisticsIndicatorsService) {}

  @Get("/v1/statistics/indicators")
  @HttpCode(200)
  listIndicators(@Query() input: IndicatorWindowDto): Promise<IndicatorCollectionDto> {
    return this.service.listIndicators(input);
  }

  @Get("/v1/statistics/indicators/:code")
  @HttpCode(200)
  getIndicator(@Param("code") code: string): Promise<IndicatorDetailDto> {
    return this.service.getIndicator({ code });
  }
}
