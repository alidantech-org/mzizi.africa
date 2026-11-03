import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InstitutionRelationshipEntity } from "#/modules/governance/entities/institution-relationship.entity.ts";
import { InstitutionEntity } from "#/modules/governance/entities/institution.entity.ts";
import { OfficeHolderEntity } from "#/modules/governance/entities/office-holder.entity.ts";
import { OfficeRuleEntity } from "#/modules/governance/entities/office-rule.entity.ts";
import { OfficeEntity } from "#/modules/governance/entities/office.entity.ts";
import { SelectionProcedureEntity } from "#/modules/governance/entities/selection-procedure.entity.ts";
import { SelectionStageEntity } from "#/modules/governance/entities/selection-stage.entity.ts";
import { GovernanceGovernanceReadServiceImpl } from "#/modules/governance/governance-read/governance-read.service.impl.ts";
import { FindInstitutionRelationshipsUseCase } from "#/modules/governance/governance-read/use-cases/find-institution-relationships.usecase.ts";
import { FindInstitutionsUseCase } from "#/modules/governance/governance-read/use-cases/find-institutions.usecase.ts";
import { FindOfficeHoldersUseCase } from "#/modules/governance/governance-read/use-cases/find-office-holders.usecase.ts";
import { FindOfficeRulesUseCase } from "#/modules/governance/governance-read/use-cases/find-office-rules.usecase.ts";
import { FindOfficesUseCase } from "#/modules/governance/governance-read/use-cases/find-offices.usecase.ts";
import { FindSelectionProceduresUseCase } from "#/modules/governance/governance-read/use-cases/find-selection-procedures.usecase.ts";
import { FindSelectionStagesUseCase } from "#/modules/governance/governance-read/use-cases/find-selection-stages.usecase.ts";
import { GetGeographyGovernanceUseCase } from "#/modules/governance/governance-read/use-cases/get-geography-governance.usecase.ts";
import { GetInstitutionByIdUseCase } from "#/modules/governance/governance-read/use-cases/get-institution-by-id.usecase.ts";
import { GetInstitutionRelationshipByIdUseCase } from "#/modules/governance/governance-read/use-cases/get-institution-relationship-by-id.usecase.ts";
import { GetOfficeByIdUseCase } from "#/modules/governance/governance-read/use-cases/get-office-by-id.usecase.ts";
import { GetOfficeHolderByIdUseCase } from "#/modules/governance/governance-read/use-cases/get-office-holder-by-id.usecase.ts";
import { GetOfficeRuleByIdUseCase } from "#/modules/governance/governance-read/use-cases/get-office-rule-by-id.usecase.ts";
import { GetSelectionProcedureByIdUseCase } from "#/modules/governance/governance-read/use-cases/get-selection-procedure-by-id.usecase.ts";
import { GetSelectionStageByIdUseCase } from "#/modules/governance/governance-read/use-cases/get-selection-stage-by-id.usecase.ts";
import { SearchOfficeHoldersUseCase } from "#/modules/governance/governance-read/use-cases/search-office-holders.usecase.ts";

import { GovernanceGovernanceReadController } from "./governance-read.controller.ts";
import { GovernanceGovernanceReadService } from "./governance-read.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InstitutionRelationshipEntity,
      InstitutionEntity,
      OfficeHolderEntity,
      OfficeRuleEntity,
      OfficeEntity,
      SelectionProcedureEntity,
      SelectionStageEntity,
    ]),
  ],
  controllers: [GovernanceGovernanceReadController],
  providers: [
    {
      provide: GovernanceGovernanceReadService,
      useClass: GovernanceGovernanceReadServiceImpl satisfies Type<GovernanceGovernanceReadService>,
    },
    FindInstitutionRelationshipsUseCase,
    FindInstitutionsUseCase,
    FindOfficeHoldersUseCase,
    FindOfficeRulesUseCase,
    FindOfficesUseCase,
    FindSelectionProceduresUseCase,
    FindSelectionStagesUseCase,
    GetGeographyGovernanceUseCase,
    GetInstitutionByIdUseCase,
    GetInstitutionRelationshipByIdUseCase,
    GetOfficeByIdUseCase,
    GetOfficeHolderByIdUseCase,
    GetOfficeRuleByIdUseCase,
    GetSelectionProcedureByIdUseCase,
    GetSelectionStageByIdUseCase,
    SearchOfficeHoldersUseCase,
  ],
  exports: [GovernanceGovernanceReadService],
})
export class GovernanceGovernanceReadModule {}