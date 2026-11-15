import { Module, type Type } from "@nestjs/common";
import { GovernanceInstitutionsServiceImpl } from "#/modules/governance/institutions/institutions.service.impl.ts";
import { BrowseInstitutionsUseCase } from "#/modules/governance/institutions/use-cases/browse-institutions.usecase.ts";
import { GetInstitutionUseCase } from "#/modules/governance/institutions/use-cases/get-institution.usecase.ts";
import { GetOfficeUseCase } from "#/modules/governance/institutions/use-cases/get-office.usecase.ts";

import { GovernanceInstitutionsController } from "./institutions.controller.ts";
import { GovernanceInstitutionsService } from "./institutions.service.ts";

@Module({
  controllers: [GovernanceInstitutionsController],
  providers: [
    {
      provide: GovernanceInstitutionsService,
      useClass: GovernanceInstitutionsServiceImpl satisfies Type<GovernanceInstitutionsService>,
    },
    BrowseInstitutionsUseCase,
    GetInstitutionUseCase,
    GetOfficeUseCase,
  ],
  exports: [GovernanceInstitutionsService],
})
export class GovernanceInstitutionsModule {}