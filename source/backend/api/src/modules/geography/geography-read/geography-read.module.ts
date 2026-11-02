import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GeoUnitEntity } from "#/modules/geography/entities/geo-unit.entity.ts";
import { ClassificationRecordEntity } from "#/modules/reference/entities/classification-record.entity.ts";
import { JurisdictionEntity } from "#/modules/reference/entities/jurisdiction.entity.ts";
import { GeographyGeographyReadServiceImpl } from "#/modules/geography/geography-read/geography-read.service.impl.ts";
import { GetChildBoundariesUseCase } from "#/modules/geography/geography-read/use-cases/get-child-boundaries.usecase.ts";
import { GetGeoUnitByIdUseCase } from "#/modules/geography/geography-read/use-cases/get-geo-unit-by-id.usecase.ts";
import { GetGeographyBoundaryUseCase } from "#/modules/geography/geography-read/use-cases/get-geography-boundary.usecase.ts";
import { GetGeographyEntityUseCase } from "#/modules/geography/geography-read/use-cases/get-geography-entity.usecase.ts";
import { SearchGeographyUseCase } from "#/modules/geography/geography-read/use-cases/search-geography.usecase.ts";

import { GeographyGeographyReadController } from "./geography-read.controller.ts";
import { GeographyGeographyReadService } from "./geography-read.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GeoUnitEntity,
      ClassificationRecordEntity,
      JurisdictionEntity,
    ]),
  ],
  controllers: [GeographyGeographyReadController],
  providers: [
    {
      provide: GeographyGeographyReadService,
      useClass:
        GeographyGeographyReadServiceImpl satisfies Type<GeographyGeographyReadService>,
    },
    GetChildBoundariesUseCase,
    GetGeoUnitByIdUseCase,
    GetGeographyBoundaryUseCase,
    GetGeographyEntityUseCase,
    SearchGeographyUseCase,
  ],
  exports: [GeographyGeographyReadService],
})
export class GeographyGeographyReadModule {}
