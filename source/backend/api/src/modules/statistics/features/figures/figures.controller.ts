import { Controller, Get, HttpCode, Query } from "@nestjs/common";
import { FigureCollectionDto } from "#/modules/statistics/schema/dto/figure-collection.dto.ts";
import { IndicatorFigureCollectionDto } from "#/modules/statistics/schema/dto/indicator-figure-collection.dto.ts";
import { IndicatorFiguresDto } from "#/modules/statistics/schema/dto/indicator-figures.dto.ts";
import { ObservationCollectionDto } from "#/modules/statistics/schema/dto/observation-collection.dto.ts";
import { ObservationScopeDto } from "#/modules/statistics/schema/dto/observation-scope.dto.ts";
import { PlaceFiguresDto } from "#/modules/statistics/schema/dto/place-figures.dto.ts";
import { StatisticsFiguresService } from "./figures.service.ts";

@Controller()
export class StatisticsFiguresController {
  constructor(private readonly service: StatisticsFiguresService) {}

  @Get("/v1/statistics/indicator-figures")
  @HttpCode(200)
  listIndicatorFigures(@Query() input: IndicatorFiguresDto): Promise<IndicatorFigureCollectionDto> {
    return this.service.listIndicatorFigures(input);
  }

  @Get("/v1/statistics/observations")
  @HttpCode(200)
  listObservations(@Query() input: ObservationScopeDto): Promise<ObservationCollectionDto> {
    return this.service.listObservations(input);
  }

  @Get("/v1/statistics/figures")
  @HttpCode(200)
  listPlaceFigures(@Query() input: PlaceFiguresDto): Promise<FigureCollectionDto> {
    return this.service.listPlaceFigures(input);
  }
}
