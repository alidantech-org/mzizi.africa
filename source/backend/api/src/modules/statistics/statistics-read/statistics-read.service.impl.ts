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
import { FindDimensionMembersUseCase } from '#/modules/statistics/statistics-read/use-cases/find-dimension-members.usecase';
import type { DimensionMemberListQueryDto } from '#/modules/statistics/dto/dimension-member-list-query.dto';
import type { DimensionMembersListResponseDto } from '#/modules/statistics/dto/dimension-members-list-response.dto';
import { FindDimensionsUseCase } from '#/modules/statistics/statistics-read/use-cases/find-dimensions.usecase';
import type { DimensionListQueryDto } from '#/modules/statistics/dto/dimension-list-query.dto';
import type { DimensionsListResponseDto } from '#/modules/statistics/dto/dimensions-list-response.dto';
import { FindObservationDerivationsUseCase } from '#/modules/statistics/statistics-read/use-cases/find-observation-derivations.usecase';
import type { ObservationDerivationListQueryDto } from '#/modules/statistics/dto/observation-derivation-list-query.dto';
import type { ObservationDerivationsListResponseDto } from '#/modules/statistics/dto/observation-derivations-list-response.dto';
import { FindObservationDimensionsUseCase } from '#/modules/statistics/statistics-read/use-cases/find-observation-dimensions.usecase';
import type { ObservationDimensionListQueryDto } from '#/modules/statistics/dto/observation-dimension-list-query.dto';
import type { ObservationDimensionsListResponseDto } from '#/modules/statistics/dto/observation-dimensions-list-response.dto';
import { FindVintagesUseCase } from '#/modules/statistics/statistics-read/use-cases/find-vintages.usecase';
import type { VintageListQueryDto } from '#/modules/statistics/dto/vintage-list-query.dto';
import type { VintagesListResponseDto } from '#/modules/statistics/dto/vintages-list-response.dto';
import { GetDimensionByIdUseCase } from '#/modules/statistics/statistics-read/use-cases/get-dimension-by-id.usecase';
import type { DimensionResponseDto } from '#/modules/statistics/dto/dimension-response.dto';
import { GetDimensionMemberByIdUseCase } from '#/modules/statistics/statistics-read/use-cases/get-dimension-member-by-id.usecase';
import type { DimensionMemberResponseDto } from '#/modules/statistics/dto/dimension-member-response.dto';
import { GetObservationDerivationByIdUseCase } from '#/modules/statistics/statistics-read/use-cases/get-observation-derivation-by-id.usecase';
import type { ObservationDerivationResponseDto } from '#/modules/statistics/dto/observation-derivation-response.dto';
import { GetObservationDimensionByIdUseCase } from '#/modules/statistics/statistics-read/use-cases/get-observation-dimension-by-id.usecase';
import type { ObservationDimensionResponseDto } from '#/modules/statistics/dto/observation-dimension-response.dto';
import { GetVintageByIdUseCase } from '#/modules/statistics/statistics-read/use-cases/get-vintage-by-id.usecase';
import type { VintageResponseDto } from '#/modules/statistics/dto/vintage-response.dto';

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
    private readonly findDimensionMembersUseCase: FindDimensionMembersUseCase,
    private readonly findDimensionsUseCase: FindDimensionsUseCase,
    private readonly findObservationDerivationsUseCase: FindObservationDerivationsUseCase,
    private readonly findObservationDimensionsUseCase: FindObservationDimensionsUseCase,
    private readonly findVintagesUseCase: FindVintagesUseCase,
    private readonly getDimensionByIdUseCase: GetDimensionByIdUseCase,
    private readonly getDimensionMemberByIdUseCase: GetDimensionMemberByIdUseCase,
    private readonly getObservationDerivationByIdUseCase: GetObservationDerivationByIdUseCase,
    private readonly getObservationDimensionByIdUseCase: GetObservationDimensionByIdUseCase,
    private readonly getVintageByIdUseCase: GetVintageByIdUseCase,
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

  /** findDimensionMembers. */
  findDimensionMembers(input: DimensionMemberListQueryDto) {
    return this.findDimensionMembersUseCase.execute(input);
  }

  /** findDimensions. */
  findDimensions(input: DimensionListQueryDto) {
    return this.findDimensionsUseCase.execute(input);
  }

  /** findObservationDerivations. */
  findObservationDerivations(input: ObservationDerivationListQueryDto) {
    return this.findObservationDerivationsUseCase.execute(input);
  }

  /** findObservationDimensions. */
  findObservationDimensions(input: ObservationDimensionListQueryDto) {
    return this.findObservationDimensionsUseCase.execute(input);
  }

  /** findVintages. */
  findVintages(input: VintageListQueryDto) {
    return this.findVintagesUseCase.execute(input);
  }

  /** getDimensionById. */
  getDimensionById(input: { dimensionId: string }) {
    return this.getDimensionByIdUseCase.execute(input);
  }

  /** getDimensionMemberById. */
  getDimensionMemberById(input: { memberId: string }) {
    return this.getDimensionMemberByIdUseCase.execute(input);
  }

  /** getObservationDerivationById. */
  getObservationDerivationById(input: { derivationId: string }) {
    return this.getObservationDerivationByIdUseCase.execute(input);
  }

  /** getObservationDimensionById. */
  getObservationDimensionById(input: { observationDimensionId: string }) {
    return this.getObservationDimensionByIdUseCase.execute(input);
  }

  /** getVintageById. */
  getVintageById(input: { vintageId: string }) {
    return this.getVintageByIdUseCase.execute(input);
  }
}
