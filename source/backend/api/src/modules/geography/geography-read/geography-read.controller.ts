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
import { GeoUnitResponseDto } from "#/modules/geography/dto/geo-unit-response.dto.ts";
import { GeographyBoundariesQueryDto } from "#/modules/geography/dto/geography-boundaries-query.dto.ts";
import { GeographyEntityDto } from "#/modules/geography/dto/geography-entity.dto.ts";
import { GeographyFeatureResponseDto } from "#/modules/geography/dto/geography-feature-response.dto.ts";
import { GeographyHierarchyResponseDto } from "#/modules/geography/dto/geography-hierarchy-response.dto.ts";
import { GeographyHistoryResponseDto } from "#/modules/geography/dto/geography-history-response.dto.ts";
import { GeographyMapContextResponseDto } from "#/modules/geography/dto/geography-map-context-response.dto.ts";
import { GeographySearchQueryDto } from "#/modules/geography/dto/geography-search-query.dto.ts";
import { GeographySearchResponseDto } from "#/modules/geography/dto/geography-search-response.dto.ts";
import { GeographyGeographyReadService } from "./geography-read.service.ts";

@Controller()
export class GeographyGeographyReadController {
  constructor(private readonly service: GeographyGeographyReadService) {}


  @Get("/v1/geography/boundaries")
  @HttpCode(200)
  listBoundariesByLevel(
    @Query() input: GeographyBoundariesQueryDto,
  ): Promise<GeographyFeatureResponseDto> {
    return this.service.listBoundariesByLevel(input);
  }


  @Get("/v1/geography/search")
  @HttpCode(200)
  searchGeography(
    @Query() input: GeographySearchQueryDto,
  ): Promise<GeographySearchResponseDto> {
    return this.service.searchGeography(input);
  }


  @Get("/v1/geography/entities/:entityId/children/boundaries")
  @HttpCode(200)
  getChildBoundaries(
    @Param("entityId") entityId: string,
  ): Promise<GeographyFeatureResponseDto> {
    return this.service.getChildBoundaries({ entityId });
  }


  @Get("/v1/geography/units/:unitId")
  @HttpCode(200)
  getGeoUnitById(
    @Param("unitId") unitId: string,
  ): Promise<GeoUnitResponseDto> {
    return this.service.getGeoUnitById({ unitId });
  }


  @Get("/v1/geography/entities/:entityId/boundary")
  @HttpCode(200)
  getGeographyBoundary(
    @Param("entityId") entityId: string,
  ): Promise<GeographyFeatureResponseDto> {
    return this.service.getGeographyBoundary({ entityId });
  }


  @Get("/v1/geography/entities/:entityId")
  @HttpCode(200)
  getGeographyEntity(
    @Param("entityId") entityId: string,
  ): Promise<GeographyEntityDto> {
    return this.service.getGeographyEntity({ entityId });
  }


  @Get("/v1/geography/entities/:entityId/hierarchy")
  @HttpCode(200)
  getGeographyHierarchy(
    @Param("entityId") entityId: string,
  ): Promise<GeographyHierarchyResponseDto> {
    return this.service.getGeographyHierarchy({ entityId });
  }


  @Get("/v1/geography/entities/:entityId/history")
  @HttpCode(200)
  getGeographyHistory(
    @Param("entityId") entityId: string,
  ): Promise<GeographyHistoryResponseDto> {
    return this.service.getGeographyHistory({ entityId });
  }


  @Get("/v1/geography/entities/:entityId/map-context")
  @HttpCode(200)
  getGeographyMapContext(
    @Param("entityId") entityId: string,
  ): Promise<GeographyMapContextResponseDto> {
    return this.service.getGeographyMapContext({ entityId });
  }
}