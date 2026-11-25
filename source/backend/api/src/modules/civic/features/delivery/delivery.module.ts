import { Module, type Type } from "@nestjs/common";
import { GetProjectUseCase } from "#/modules/civic/features/delivery/use-cases/get-project.repository.ts";
import { ListFacilitiesUseCase } from "#/modules/civic/features/delivery/use-cases/list-facilities.repository.ts";
import { ListPlaceProjectsUseCase } from "#/modules/civic/features/delivery/use-cases/list-place-projects.repository.ts";

import { CivicDeliveryController } from "./delivery.controller.ts";
import { CivicDeliveryService, CivicDeliveryServiceImpl } from "./delivery.service.ts";

@Module({
  controllers: [CivicDeliveryController],
  providers: [
    {
      provide: CivicDeliveryService,
      useClass: CivicDeliveryServiceImpl satisfies Type<CivicDeliveryService>,
    },
    GetProjectUseCase,
    ListFacilitiesUseCase,
    ListPlaceProjectsUseCase,
  ],
  exports: [CivicDeliveryService],
})
export class CivicDeliveryModule {}
