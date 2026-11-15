import { Module, type Type } from "@nestjs/common";
import { GeographyPlacesServiceImpl } from "#/modules/geography/features/places/places.service.impl.ts";
import { BrowseUnitsUseCase } from "#/modules/geography/features/places/use-cases/browse-units.usecase.ts";
import { GetUnitUseCase } from "#/modules/geography/features/places/use-cases/get-unit.usecase.ts";

import { GeographyPlacesController } from "./places.controller.ts";
import { GeographyPlacesService } from "./places.service.ts";

@Module({
  controllers: [GeographyPlacesController],
  providers: [
    {
      provide: GeographyPlacesService,
      useClass: GeographyPlacesServiceImpl satisfies Type<GeographyPlacesService>,
    },
    BrowseUnitsUseCase,
    GetUnitUseCase,
  ],
  exports: [GeographyPlacesService],
})
export class GeographyPlacesModule {}