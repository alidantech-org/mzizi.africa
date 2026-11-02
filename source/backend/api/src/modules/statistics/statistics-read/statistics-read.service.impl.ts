import { Injectable } from '@nestjs/common';
import type { IndicatorCategoriesListResponseDto } from '#/modules/statistics/dto/indicator-categories-list-response.dto';
import type { IndicatorCategoryListQueryDto } from '#/modules/statistics/dto/indicator-category-list-query.dto';
import type { IndicatorCategoryResponseDto } from '#/modules/statistics/dto/indicator-category-response.dto';
import type { IndicatorColumnListQueryDto } from '#/modules/statistics/dto/indicator-column-list-query.dto';
import type { IndicatorColumnResponseDto } from '#/modules/statistics/dto/indicator-column-response.dto';
import type { IndicatorColumnsListResponseDto } from '#/modules/statistics/dto/indicator-columns-list-response.dto';
import type { IndicatorListQueryDto } from '#/modules/statistics/dto/indicator-list-query.dto';
import type { IndicatorResponseDto } from '#/modules/statistics/dto/indicator-response.dto';
import type { IndicatorsListResponseDto } from '#/modules/statistics/dto/indicators-list-response.dto';
import type { ObservationListQueryDto } from '#/modules/statistics/dto/observation-list-query.dto';
import type { ObservationResponseDto } from '#/modules/statistics/dto/observation-response.dto';
import type { ObservationsListResponseDto } from '#/modules/statistics/dto/observations-list-response.dto';
import type { PeriodListQueryDto } from '#/modules/statistics/dto/period-list-query.dto';
import type { PeriodResponseDto } from '#/modules/statistics/dto/period-response.dto';
import type { PeriodsListResponseDto } from '#/modules/statistics/dto/periods-list-response.dto';
import type { StatisticsTableListQueryDto } from '#/modules/statistics/dto/statistics-table-list-query.dto';
import type { StatisticsTableResponseDto } from '#/modules/statistics/dto/statistics-table-response.dto';
import type { StatisticsTablesListResponseDto } from '#/modules/statistics/dto/statistics-tables-list-response.dto';
import { FindIndicatorCategoriesUseCase } from '#/modules/statistics/statistics-read/use-cases/find-indicator-categories.usecase';
import { FindIndicatorColumnsUseCase } from '#/modules/statistics/statistics-read/use-cases/find-indicator-columns.usecase';
import { FindIndicatorsUseCase } from '#/modules/statistics/statistics-read/use-cases/find-indicators.usecase';
import { FindObservationsUseCase } from '#/modules/statistics/statistics-read/use-cases/find-observations.usecase';
import { FindPeriodsUseCase } from '#/modules/statistics/statistics-read/use-cases/find-periods.usecase';
import { FindStatisticsTablesUseCase } from '#/modules/statistics/statistics-read/use-cases/find-statistics-tables.usecase';
import { GetIndicatorByIdUseCase } from '#/modules/statistics/statistics-read/use-cases/get-indicator-by-id.usecase';
import { GetIndicatorCategoryByIdUseCase } from '#/modules/statistics/statistics-read/use-cases/get-indicator-category-by-id.usecase';
import { GetIndicatorColumnByIdUseCase } from '#/modules/statistics/statistics-read/use-cases/get-indicator-column-by-id.usecase';
import { GetObservationByIdUseCase } from '#/modules/statistics/statistics-read/use-cases/get-observation-by-id.usecase';
import { GetPeriodByIdUseCase } from '#/modules/statistics/statistics-read/use-cases/get-period-by-id.usecase';
import { GetStatisticsTableByIdUseCase } from '#/modules/statistics/statistics-read/use-cases/get-statistics-table-by-id.usecase';

/**
 * Statistics Read: implements the generated StatisticsStatisticsReadService contract by
 * delegating to one use case per operation. The feature module binds it to that contract.
 *
 * Scaffolded by Dryv once; this file belongs to the project. New operations need a method here.
 */
@Injectable()
export class StatisticsStatisticsReadServiceImpl {
  constructor(
    private readonly findIndicatorCategoriesUseCase: FindIndicatorCategoriesUseCase,
    private readonly findIndicatorColumnsUseCase: FindIndicatorColumnsUseCase,
    private readonly findIndicatorsUseCase: FindIndicatorsUseCase,
    private readonly findObservationsUseCase: FindObservationsUseCase,
    private readonly findPeriodsUseCase: FindPeriodsUseCase,
    private readonly findStatisticsTablesUseCase: FindStatisticsTablesUseCase,
    private readonly getIndicatorByIdUseCase: GetIndicatorByIdUseCase,
    private readonly getIndicatorCategoryByIdUseCase: GetIndicatorCategoryByIdUseCase,
    private readonly getIndicatorColumnByIdUseCase: GetIndicatorColumnByIdUseCase,
    private readonly getObservationByIdUseCase: GetObservationByIdUseCase,
    private readonly getPeriodByIdUseCase: GetPeriodByIdUseCase,
    private readonly getStatisticsTableByIdUseCase: GetStatisticsTableByIdUseCase,
  ) {}

  /** List indicator categories. */
  findIndicatorCategories(input: IndicatorCategoryListQueryDto) {
    return this.findIndicatorCategoriesUseCase.execute(input);
  }

  /** List indicator columns. */
  findIndicatorColumns(input: IndicatorColumnListQueryDto) {
    return this.findIndicatorColumnsUseCase.execute(input);
  }

  /** List indicators. */
  findIndicators(input: IndicatorListQueryDto) {
    return this.findIndicatorsUseCase.execute(input);
  }

  /** List observations. */
  findObservations(input: ObservationListQueryDto) {
    return this.findObservationsUseCase.execute(input);
  }

  /** List periods. */
  findPeriods(input: PeriodListQueryDto) {
    return this.findPeriodsUseCase.execute(input);
  }

  /** List statistics tables. */
  findStatisticsTables(input: StatisticsTableListQueryDto) {
    return this.findStatisticsTablesUseCase.execute(input);
  }

  /** Get indicators by id. */
  getIndicatorById(input: { indicatorId: string }) {
    return this.getIndicatorByIdUseCase.execute(input);
  }

  /** Get indicator categories by id. */
  getIndicatorCategoryById(input: { categoryId: string }) {
    return this.getIndicatorCategoryByIdUseCase.execute(input);
  }

  /** Get indicator columns by id. */
  getIndicatorColumnById(input: { columnId: string }) {
    return this.getIndicatorColumnByIdUseCase.execute(input);
  }

  /** Get observations by id. */
  getObservationById(input: { observationId: string }) {
    return this.getObservationByIdUseCase.execute(input);
  }

  /** Get periods by id. */
  getPeriodById(input: { periodId: string }) {
    return this.getPeriodByIdUseCase.execute(input);
  }

  /** Get statistics tables by id. */
  getStatisticsTableById(input: { tableId: string }) {
    return this.getStatisticsTableByIdUseCase.execute(input);
  }
}