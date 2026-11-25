import { Module, type Type } from "@nestjs/common";
import { GetOutlineUseCase } from "#/modules/geography/features/maps/use-cases/get-outline.repository.ts";
import { ListChildOutlinesUseCase } from "#/modules/geography/features/maps/use-cases/list-child-outlines.repository.ts";

import { GeographyMapsController } from "./maps.controller.ts";
import { GeographyMapsService, GeographyMapsServiceImpl } from "./maps.service.ts";

@Module({
  controllers: [GeographyMapsController],
  providers: [
    {
      provide: GeographyMapsService,
      useClass: GeographyMapsServiceImpl satisfies Type<GeographyMapsService>,
    },
    GetOutlineUseCase,
    ListChildOutlinesUseCase,
  ],
  exports: [GeographyMapsService],
})
export class GeographyMapsModule {}
