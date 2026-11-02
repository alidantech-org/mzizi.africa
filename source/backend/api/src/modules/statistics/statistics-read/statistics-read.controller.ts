import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  ParseBoolPipe,
  ParseFloatPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from "@nestjs/common";

import { Cookie } from "#/modules/common/server/http/cookie.decorator.ts";
import { DimensionListQueryDto } from "#/modules/statistics/dto/dimension-list-query.dto.ts";
import { DimensionMemberListQueryDto } from "#/modules/statistics/dto/dimension-member-list-query.dto.ts";
import { DimensionMemberResponseDto } from "#/modules/statistics/dto/dimension-member-response.dto.ts";
import { DimensionMembersListResponseDto } from "#/modules/statistics/dto/dimension-members-list-response.dto.ts";
import { DimensionResponseDto } from "#/modules/statistics/dto/dimension-response.dto.ts";
import { DimensionsListResponseDto } from "#/modules/statistics/dto/dimensions-list-response.dto.ts";
import { IndicatorCategoriesListResponseDto } from "#/modules/statistics/dto/indicator-categories-list-response.dto.ts";
import { IndicatorCategoryListQueryDto } from "#/modules/statistics/dto/indicator-category-list-query.dto.ts";
import { IndicatorCategoryResponseDto } from "#/modules/statistics/dto/indicator-category-response.dto.ts";
import { IndicatorColumnListQueryDto } from "#/modules/statistics/dto/indicator-column-list-query.dto.ts";
import { IndicatorColumnResponseDto } from "#/modules/statistics/dto/indicator-column-response.dto.ts";
import { IndicatorColumnsListResponseDto } from "#/modules/statistics/dto/indicator-columns-list-response.dto.ts";
import { IndicatorListQueryDto } from "#/modules/statistics/dto/indicator-list-query.dto.ts";
import { IndicatorResponseDto } from "#/modules/statistics/dto/indicator-response.dto.ts";
import { IndicatorsListResponseDto } from "#/modules/statistics/dto/indicators-list-response.dto.ts";
import { ObservationDerivationListQueryDto } from "#/modules/statistics/dto/observation-derivation-list-query.dto.ts";
import { ObservationDerivationResponseDto } from "#/modules/statistics/dto/observation-derivation-response.dto.ts";
import { ObservationDerivationsListResponseDto } from "#/modules/statistics/dto/observation-derivations-list-response.dto.ts";
import { ObservationDimensionListQueryDto } from "#/modules/statistics/dto/observation-dimension-list-query.dto.ts";
import { ObservationDimensionResponseDto } from "#/modules/statistics/dto/observation-dimension-response.dto.ts";
import { ObservationDimensionsListResponseDto } from "#/modules/statistics/dto/observation-dimensions-list-response.dto.ts";
import { ObservationListQueryDto } from "#/modules/statistics/dto/observation-list-query.dto.ts";
import { ObservationResponseDto } from "#/modules/statistics/dto/observation-response.dto.ts";
import { ObservationsListResponseDto } from "#/modules/statistics/dto/observations-list-response.dto.ts";
import { PeriodListQueryDto } from "#/modules/statistics/dto/period-list-query.dto.ts";
import { PeriodResponseDto } from "#/modules/statistics/dto/period-response.dto.ts";
import { PeriodsListResponseDto } from "#/modules/statistics/dto/periods-list-response.dto.ts";
import { StatisticsTableListQueryDto } from "#/modules/statistics/dto/statistics-table-list-query.dto.ts";
import { StatisticsTableResponseDto } from "#/modules/statistics/dto/statistics-table-response.dto.ts";
import { StatisticsTablesListResponseDto } from "#/modules/statistics/dto/statistics-tables-list-response.dto.ts";
import { VintageListQueryDto } from "#/modules/statistics/dto/vintage-list-query.dto.ts";
import { VintageResponseDto } from "#/modules/statistics/dto/vintage-response.dto.ts";
import { VintagesListResponseDto } from "#/modules/statistics/dto/vintages-list-response.dto.ts";
import { StatisticsStatisticsReadService } from "./statistics-read.service.ts";

@Controller()
export class StatisticsStatisticsReadController {
  constructor(private readonly service: StatisticsStatisticsReadService) {}


  @Get("/v1/statistics/dimension-members")
  @HttpCode(200)
  findDimensionMembers(
    @Query() input: DimensionMemberListQueryDto,
  ): Promise<DimensionMembersListResponseDto> {
    return this.service.findDimensionMembers(input);
  }


  @Get("/v1/statistics/dimensions")
  @HttpCode(200)
  findDimensions(
    @Query() input: DimensionListQueryDto,
  ): Promise<DimensionsListResponseDto> {
    return this.service.findDimensions(input);
  }


  @Get("/v1/statistics/indicator-categories")
  @HttpCode(200)
  findIndicatorCategories(
    @Query() input: IndicatorCategoryListQueryDto,
  ): Promise<IndicatorCategoriesListResponseDto> {
    return this.service.findIndicatorCategories(input);
  }


  @Get("/v1/statistics/indicator-columns")
  @HttpCode(200)
  findIndicatorColumns(
    @Query() input: IndicatorColumnListQueryDto,
  ): Promise<IndicatorColumnsListResponseDto> {
    return this.service.findIndicatorColumns(input);
  }


  @Get("/v1/statistics/indicators")
  @HttpCode(200)
  findIndicators(
    @Query() input: IndicatorListQueryDto,
  ): Promise<IndicatorsListResponseDto> {
    return this.service.findIndicators(input);
  }


  @Get("/v1/statistics/observation-derivations")
  @HttpCode(200)
  findObservationDerivations(
    @Query() input: ObservationDerivationListQueryDto,
  ): Promise<ObservationDerivationsListResponseDto> {
    return this.service.findObservationDerivations(input);
  }


  @Get("/v1/statistics/observation-dimensions")
  @HttpCode(200)
  findObservationDimensions(
    @Query() input: ObservationDimensionListQueryDto,
  ): Promise<ObservationDimensionsListResponseDto> {
    return this.service.findObservationDimensions(input);
  }


  @Get("/v1/statistics/observations")
  @HttpCode(200)
  findObservations(
    @Query() input: ObservationListQueryDto,
  ): Promise<ObservationsListResponseDto> {
    return this.service.findObservations(input);
  }


  @Get("/v1/statistics/periods")
  @HttpCode(200)
  findPeriods(
    @Query() input: PeriodListQueryDto,
  ): Promise<PeriodsListResponseDto> {
    return this.service.findPeriods(input);
  }


  @Get("/v1/statistics/tables")
  @HttpCode(200)
  findStatisticsTables(
    @Query() input: StatisticsTableListQueryDto,
  ): Promise<StatisticsTablesListResponseDto> {
    return this.service.findStatisticsTables(input);
  }


  @Get("/v1/statistics/vintages")
  @HttpCode(200)
  findVintages(
    @Query() input: VintageListQueryDto,
  ): Promise<VintagesListResponseDto> {
    return this.service.findVintages(input);
  }


  @Get("/v1/statistics/dimensions/:dimensionId")
  @HttpCode(200)
  getDimensionById(
    @Param("dimensionId") dimensionId: string,
  ): Promise<DimensionResponseDto> {
    return this.service.getDimensionById({ dimensionId });
  }


  @Get("/v1/statistics/dimension-members/:memberId")
  @HttpCode(200)
  getDimensionMemberById(
    @Param("memberId") memberId: string,
  ): Promise<DimensionMemberResponseDto> {
    return this.service.getDimensionMemberById({ memberId });
  }


  @Get("/v1/statistics/indicators/:indicatorId")
  @HttpCode(200)
  getIndicatorById(
    @Param("indicatorId") indicatorId: string,
  ): Promise<IndicatorResponseDto> {
    return this.service.getIndicatorById({ indicatorId });
  }


  @Get("/v1/statistics/indicator-categories/:categoryId")
  @HttpCode(200)
  getIndicatorCategoryById(
    @Param("categoryId") categoryId: string,
  ): Promise<IndicatorCategoryResponseDto> {
    return this.service.getIndicatorCategoryById({ categoryId });
  }


  @Get("/v1/statistics/indicator-columns/:columnId")
  @HttpCode(200)
  getIndicatorColumnById(
    @Param("columnId") columnId: string,
  ): Promise<IndicatorColumnResponseDto> {
    return this.service.getIndicatorColumnById({ columnId });
  }


  @Get("/v1/statistics/observations/:observationId")
  @HttpCode(200)
  getObservationById(
    @Param("observationId") observationId: string,
  ): Promise<ObservationResponseDto> {
    return this.service.getObservationById({ observationId });
  }


  @Get("/v1/statistics/observation-derivations/:derivationId")
  @HttpCode(200)
  getObservationDerivationById(
    @Param("derivationId") derivationId: string,
  ): Promise<ObservationDerivationResponseDto> {
    return this.service.getObservationDerivationById({ derivationId });
  }


  @Get("/v1/statistics/observation-dimensions/:observationDimensionId")
  @HttpCode(200)
  getObservationDimensionById(
    @Param("observationDimensionId") observationDimensionId: string,
  ): Promise<ObservationDimensionResponseDto> {
    return this.service.getObservationDimensionById({ observationDimensionId });
  }


  @Get("/v1/statistics/periods/:periodId")
  @HttpCode(200)
  getPeriodById(
    @Param("periodId") periodId: string,
  ): Promise<PeriodResponseDto> {
    return this.service.getPeriodById({ periodId });
  }


  @Get("/v1/statistics/tables/:tableId")
  @HttpCode(200)
  getStatisticsTableById(
    @Param("tableId") tableId: string,
  ): Promise<StatisticsTableResponseDto> {
    return this.service.getStatisticsTableById({ tableId });
  }


  @Get("/v1/statistics/vintages/:vintageId")
  @HttpCode(200)
  getVintageById(
    @Param("vintageId") vintageId: string,
  ): Promise<VintageResponseDto> {
    return this.service.getVintageById({ vintageId });
  }
}