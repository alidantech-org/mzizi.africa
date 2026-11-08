import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DimensionMemberEntity } from "#/modules/statistics/entities/dimension-member.entity.ts";
import { DimensionEntity } from "#/modules/statistics/entities/dimension.entity.ts";
import { IndicatorCategoryEntity } from "#/modules/statistics/entities/indicator-category.entity.ts";
import { IndicatorColumnEntity } from "#/modules/statistics/entities/indicator-column.entity.ts";
import { IndicatorEntity } from "#/modules/statistics/entities/indicator.entity.ts";
import { ObservationDerivationEntity } from "#/modules/statistics/entities/observation-derivation.entity.ts";
import { ObservationDimensionEntity } from "#/modules/statistics/entities/observation-dimension.entity.ts";
import { ObservationEntity } from "#/modules/statistics/entities/observation.entity.ts";
import { PeriodEntity } from "#/modules/statistics/entities/period.entity.ts";
import { StatisticsTableEntity } from "#/modules/statistics/entities/statistics-table.entity.ts";
import { VintageEntity } from "#/modules/statistics/entities/vintage.entity.ts";
import { StatisticsStatisticsReadServiceImpl } from "#/modules/statistics/statistics-read/statistics-read.service.impl.ts";
import { FindDimensionMembersUseCase } from "#/modules/statistics/statistics-read/use-cases/find-dimension-members.usecase.ts";
import { FindDimensionsUseCase } from "#/modules/statistics/statistics-read/use-cases/find-dimensions.usecase.ts";
import { FindIndicatorCategoriesUseCase } from "#/modules/statistics/statistics-read/use-cases/find-indicator-categories.usecase.ts";
import { FindIndicatorColumnsUseCase } from "#/modules/statistics/statistics-read/use-cases/find-indicator-columns.usecase.ts";
import { FindIndicatorsUseCase } from "#/modules/statistics/statistics-read/use-cases/find-indicators.usecase.ts";
import { FindObservationDerivationsUseCase } from "#/modules/statistics/statistics-read/use-cases/find-observation-derivations.usecase.ts";
import { FindObservationDimensionsUseCase } from "#/modules/statistics/statistics-read/use-cases/find-observation-dimensions.usecase.ts";
import { FindObservationsUseCase } from "#/modules/statistics/statistics-read/use-cases/find-observations.usecase.ts";
import { FindPeriodsUseCase } from "#/modules/statistics/statistics-read/use-cases/find-periods.usecase.ts";
import { FindStatisticsTablesUseCase } from "#/modules/statistics/statistics-read/use-cases/find-statistics-tables.usecase.ts";
import { FindVintagesUseCase } from "#/modules/statistics/statistics-read/use-cases/find-vintages.usecase.ts";
import { GetDimensionByIdUseCase } from "#/modules/statistics/statistics-read/use-cases/get-dimension-by-id.usecase.ts";
import { GetDimensionMemberByIdUseCase } from "#/modules/statistics/statistics-read/use-cases/get-dimension-member-by-id.usecase.ts";
import { GetIndicatorByIdUseCase } from "#/modules/statistics/statistics-read/use-cases/get-indicator-by-id.usecase.ts";
import { GetIndicatorCategoryByIdUseCase } from "#/modules/statistics/statistics-read/use-cases/get-indicator-category-by-id.usecase.ts";
import { GetIndicatorColumnByIdUseCase } from "#/modules/statistics/statistics-read/use-cases/get-indicator-column-by-id.usecase.ts";
import { GetObservationByIdUseCase } from "#/modules/statistics/statistics-read/use-cases/get-observation-by-id.usecase.ts";
import { GetObservationDerivationByIdUseCase } from "#/modules/statistics/statistics-read/use-cases/get-observation-derivation-by-id.usecase.ts";
import { GetObservationDimensionByIdUseCase } from "#/modules/statistics/statistics-read/use-cases/get-observation-dimension-by-id.usecase.ts";
import { GetPeriodByIdUseCase } from "#/modules/statistics/statistics-read/use-cases/get-period-by-id.usecase.ts";
import { GetStatisticsTableByIdUseCase } from "#/modules/statistics/statistics-read/use-cases/get-statistics-table-by-id.usecase.ts";
import { GetVintageByIdUseCase } from "#/modules/statistics/statistics-read/use-cases/get-vintage-by-id.usecase.ts";

import { StatisticsStatisticsReadController } from "./statistics-read.controller.ts";
import { StatisticsStatisticsReadService } from "./statistics-read.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DimensionMemberEntity,
      DimensionEntity,
      IndicatorCategoryEntity,
      IndicatorColumnEntity,
      IndicatorEntity,
      ObservationDerivationEntity,
      ObservationDimensionEntity,
      ObservationEntity,
      PeriodEntity,
      StatisticsTableEntity,
      VintageEntity,
    ]),
  ],
  controllers: [StatisticsStatisticsReadController],
  providers: [
    {
      provide: StatisticsStatisticsReadService,
      useClass: StatisticsStatisticsReadServiceImpl satisfies Type<StatisticsStatisticsReadService>,
    },
    FindDimensionMembersUseCase,
    FindDimensionsUseCase,
    FindIndicatorCategoriesUseCase,
    FindIndicatorColumnsUseCase,
    FindIndicatorsUseCase,
    FindObservationDerivationsUseCase,
    FindObservationDimensionsUseCase,
    FindObservationsUseCase,
    FindPeriodsUseCase,
    FindStatisticsTablesUseCase,
    FindVintagesUseCase,
    GetDimensionByIdUseCase,
    GetDimensionMemberByIdUseCase,
    GetIndicatorByIdUseCase,
    GetIndicatorCategoryByIdUseCase,
    GetIndicatorColumnByIdUseCase,
    GetObservationByIdUseCase,
    GetObservationDerivationByIdUseCase,
    GetObservationDimensionByIdUseCase,
    GetPeriodByIdUseCase,
    GetStatisticsTableByIdUseCase,
    GetVintageByIdUseCase,
  ],
  exports: [StatisticsStatisticsReadService],
})
export class StatisticsStatisticsReadModule {}