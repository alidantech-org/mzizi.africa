import { Module, type Type } from "@nestjs/common";
import { FindPlacesAtPointUseCase } from "#/modules/geography/features/places/use-cases/find-places-at-point.repository.ts";
import { GetPlaceUseCase } from "#/modules/geography/features/places/use-cases/get-place.repository.ts";
import { ListChildrenUseCase } from "#/modules/geography/features/places/use-cases/list-children.repository.ts";
import { ListPlacesUseCase } from "#/modules/geography/features/places/use-cases/list-places.repository.ts";

import { GeographyPlacesController } from "./places.controller.ts";
import { GeographyPlacesService, GeographyPlacesServiceImpl } from "./places.service.ts";

@Module({
  controllers: [GeographyPlacesController],
  providers: [
    {
      provide: GeographyPlacesService,
      useClass: GeographyPlacesServiceImpl satisfies Type<GeographyPlacesService>,
    },
    FindPlacesAtPointUseCase,
    GetPlaceUseCase,
    ListChildrenUseCase,
    ListPlacesUseCase,
  ],
  exports: [GeographyPlacesService],
})
export class GeographyPlacesModule {}
