import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FeaturesEntity } from "#/modules/geography/schema/entities/features.entity.ts";
import { GeographyNamesEntity } from "#/modules/geography/schema/entities/names.entity.ts";
import { UnitsEntity } from "#/modules/geography/schema/entities/units.entity.ts";
import { CountryEntity } from "#/modules/reference/schema/entities/country.entity.ts";
import { SchemeEntity } from "#/modules/reference/schema/entities/scheme.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { GeographyPlacesRepository } from "#/modules/geography/features/places/repositories/places.repository.ts";
import { BrowseUnitsUseCase } from "#/modules/geography/features/places/use-cases/browse-units.usecase.ts";
import { GetUnitUseCase } from "#/modules/geography/features/places/use-cases/get-unit.usecase.ts";

import { GeographyPlacesController } from "./places.controller.ts";
import { GeographyPlacesService, GeographyPlacesServiceImpl } from "./places.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FeaturesEntity,
      GeographyNamesEntity,
      UnitsEntity,
      CountryEntity,
      SchemeEntity,
      ValueEntity,
    ]),
  ],
  controllers: [GeographyPlacesController],
  providers: [
    {
      provide: GeographyPlacesService,
      useClass: GeographyPlacesServiceImpl satisfies Type<GeographyPlacesService>,
    },
    BrowseUnitsUseCase,
    GetUnitUseCase,
    GeographyPlacesRepository,
  ],
  exports: [GeographyPlacesService],
})
export class GeographyPlacesModule {}
