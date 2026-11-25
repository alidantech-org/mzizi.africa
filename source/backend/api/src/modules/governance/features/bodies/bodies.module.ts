import { Module, type Type } from "@nestjs/common";
import { GetInstitutionUseCase } from "#/modules/governance/features/bodies/use-cases/get-institution.repository.ts";
import { ListInstitutionsUseCase } from "#/modules/governance/features/bodies/use-cases/list-institutions.repository.ts";
import { ListMembersUseCase } from "#/modules/governance/features/bodies/use-cases/list-members.repository.ts";
import { ListPowersUseCase } from "#/modules/governance/features/bodies/use-cases/list-powers.repository.ts";

import { GovernanceBodiesController } from "./bodies.controller.ts";
import { GovernanceBodiesService, GovernanceBodiesServiceImpl } from "./bodies.service.ts";

@Module({
  controllers: [GovernanceBodiesController],
  providers: [
    {
      provide: GovernanceBodiesService,
      useClass: GovernanceBodiesServiceImpl satisfies Type<GovernanceBodiesService>,
    },
    GetInstitutionUseCase,
    ListInstitutionsUseCase,
    ListMembersUseCase,
    ListPowersUseCase,
  ],
  exports: [GovernanceBodiesService],
})
export class GovernanceBodiesModule {}
