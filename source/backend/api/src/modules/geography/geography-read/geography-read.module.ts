import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GeoUnitChangeEntity } from "#/modules/geography/entities/geo-unit-change.entity.ts";
import { GeoUnitNameVersionEntity } from "#/modules/geography/entities/geo-unit-name-version.entity.ts";
import { GeoUnitEntity } from "#/modules/geography/entities/geo-unit.entity.ts";
import { GeographyGeographyReadServiceImpl } from "#/modules/geography/geography-read/geography-read.service.impl.ts";
import { GetChildBoundariesUseCase } from "#/modules/geography/geography-read/use-cases/get-child-boundaries.usecase.ts";
import { GetGeoUnitByIdUseCase } from "#/modules/geography/geography-read/use-cases/get-geo-unit-by-id.usecase.ts";
import { GetGeographyBoundaryUseCase } from "#/modules/geography/geography-read/use-cases/get-geography-boundary.usecase.ts";
import { GetGeographyEntityUseCase } from "#/modules/geography/geography-read/use-cases/get-geography-entity.usecase.ts";
import { GetGeographyHierarchyUseCase } from "#/modules/geography/geography-read/use-cases/get-geography-hierarchy.usecase.ts";
import { GetGeographyHistoryUseCase } from "#/modules/geography/geography-read/use-cases/get-geography-history.usecase.ts";
import { GetGeographyMapContextUseCase } from "#/modules/geography/geography-read/use-cases/get-geography-map-context.usecase.ts";
import { ListBoundariesByLevelUseCase } from "#/modules/geography/geography-read/use-cases/list-boundaries-by-level.usecase.ts";
import { SearchGeographyUseCase } from "#/modules/geography/geography-read/use-cases/search-geography.usecase.ts";

import { GeographyGeographyReadController } from "./geography-read.controller.ts";
import { GeographyGeographyReadService } from "./geography-read.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GeoUnitChangeEntity,
      GeoUnitNameVersionEntity,
      GeoUnitEntity,
    ]),
  ],
  controllers: [GeographyGeographyReadController],
  providers: [
    {
      provide: GeographyGeographyReadService,
      useClass: GeographyGeographyReadServiceImpl satisfies Type<GeographyGeographyReadService>,
    },
    GetChildBoundariesUseCase,
    GetGeoUnitByIdUseCase,
    GetGeographyBoundaryUseCase,
    GetGeographyEntityUseCase,
    GetGeographyHierarchyUseCase,
    GetGeographyHistoryUseCase,
    GetGeographyMapContextUseCase,
    ListBoundariesByLevelUseCase,
    SearchGeographyUseCase,
  ],
  exports: [GeographyGeographyReadService],
})
export class GeographyGeographyReadModule {}