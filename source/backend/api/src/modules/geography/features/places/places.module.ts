import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FeaturesEntity } from "#/modules/geography/schema/entities/features.entity.ts";
import { GeographyNamesEntity } from "#/modules/geography/schema/entities/names.entity.ts";
import { SchemeEntity } from "#/modules/reference/schema/entities/scheme.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { GeographyPlacesRepository } from "#/modules/geography/features/places/repositories/places.repository.ts";
import { BrowseFeaturesUseCase } from "#/modules/geography/features/places/use-cases/browse-features.usecase.ts";
import { GetFeatureUseCase } from "#/modules/geography/features/places/use-cases/get-feature.usecase.ts";

import { GeographyPlacesController } from "./places.controller.ts";
import { GeographyPlacesService, GeographyPlacesServiceImpl } from "./places.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([FeaturesEntity, GeographyNamesEntity, SchemeEntity, ValueEntity]),
  ],
  controllers: [GeographyPlacesController],
  providers: [
    {
      provide: GeographyPlacesService,
      useClass: GeographyPlacesServiceImpl satisfies Type<GeographyPlacesService>,
    },
    BrowseFeaturesUseCase,
    GetFeatureUseCase,
    GeographyPlacesRepository,
  ],
  exports: [GeographyPlacesService],
})
export class GeographyPlacesModule {}
