import { Module, type Type } from "@nestjs/common";
import { GetOfficeUseCase } from "#/modules/governance/features/seats/use-cases/get-office.repository.ts";
import { ListPlaceOfficesUseCase } from "#/modules/governance/features/seats/use-cases/list-place-offices.repository.ts";

import { GovernanceSeatsController } from "./seats.controller.ts";
import { GovernanceSeatsService, GovernanceSeatsServiceImpl } from "./seats.service.ts";

@Module({
  controllers: [GovernanceSeatsController],
  providers: [
    {
      provide: GovernanceSeatsService,
      useClass: GovernanceSeatsServiceImpl satisfies Type<GovernanceSeatsService>,
    },
    GetOfficeUseCase,
    ListPlaceOfficesUseCase,
  ],
  exports: [GovernanceSeatsService],
})
export class GovernanceSeatsModule {}
