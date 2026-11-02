import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IndicatorCategoryEntity } from "#/modules/statistics/entities/indicator-category.entity.ts";
import { IndicatorColumnEntity } from "#/modules/statistics/entities/indicator-column.entity.ts";
import { IndicatorEntity } from "#/modules/statistics/entities/indicator.entity.ts";
import { ObservationEntity } from "#/modules/statistics/entities/observation.entity.ts";
import { PeriodEntity } from "#/modules/statistics/entities/period.entity.ts";
import { StatisticsTableEntity } from "#/modules/statistics/entities/statistics-table.entity.ts";
import { StatisticsStatisticsReadServiceImpl } from "#/modules/statistics/statistics-read/statistics-read.service.impl.ts";
import { FindIndicatorCategoriesUseCase } from "#/modules/statistics/statistics-read/use-cases/find-indicator-categories.usecase.ts";
import { FindIndicatorColumnsUseCase } from "#/modules/statistics/statistics-read/use-cases/find-indicator-columns.usecase.ts";
import { FindIndicatorsUseCase } from "#/modules/statistics/statistics-read/use-cases/find-indicators.usecase.ts";
import { FindObservationsUseCase } from "#/modules/statistics/statistics-read/use-cases/find-observations.usecase.ts";
import { FindPeriodsUseCase } from "#/modules/statistics/statistics-read/use-cases/find-periods.usecase.ts";
import { FindStatisticsTablesUseCase } from "#/modules/statistics/statistics-read/use-cases/find-statistics-tables.usecase.ts";
import { GetIndicatorByIdUseCase } from "#/modules/statistics/statistics-read/use-cases/get-indicator-by-id.usecase.ts";
import { GetIndicatorCategoryByIdUseCase } from "#/modules/statistics/statistics-read/use-cases/get-indicator-category-by-id.usecase.ts";
import { GetIndicatorColumnByIdUseCase } from "#/modules/statistics/statistics-read/use-cases/get-indicator-column-by-id.usecase.ts";
import { GetObservationByIdUseCase } from "#/modules/statistics/statistics-read/use-cases/get-observation-by-id.usecase.ts";
import { GetPeriodByIdUseCase } from "#/modules/statistics/statistics-read/use-cases/get-period-by-id.usecase.ts";
import { GetStatisticsTableByIdUseCase } from "#/modules/statistics/statistics-read/use-cases/get-statistics-table-by-id.usecase.ts";

import { StatisticsStatisticsReadController } from "./statistics-read.controller.ts";
import { StatisticsStatisticsReadService } from "./statistics-read.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IndicatorCategoryEntity,
      IndicatorColumnEntity,
      IndicatorEntity,
      ObservationEntity,
      PeriodEntity,
      StatisticsTableEntity,
    ]),
  ],
  controllers: [StatisticsStatisticsReadController],
  providers: [
    {
      provide: StatisticsStatisticsReadService,
      useClass: StatisticsStatisticsReadServiceImpl satisfies Type<StatisticsStatisticsReadService>,
    },
    FindIndicatorCategoriesUseCase,
    FindIndicatorColumnsUseCase,
    FindIndicatorsUseCase,
    FindObservationsUseCase,
    FindPeriodsUseCase,
    FindStatisticsTablesUseCase,
    GetIndicatorByIdUseCase,
    GetIndicatorCategoryByIdUseCase,
    GetIndicatorColumnByIdUseCase,
    GetObservationByIdUseCase,
    GetPeriodByIdUseCase,
    GetStatisticsTableByIdUseCase,
  ],
  exports: [StatisticsStatisticsReadService],
})
export class StatisticsStatisticsReadModule {}