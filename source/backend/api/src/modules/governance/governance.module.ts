import { Module } from "@nestjs/common";
import { GovernanceInstitutionsModule } from "#/modules/governance/institutions/institutions.module.ts";

@Module({
  imports: [
    GovernanceInstitutionsModule,
  ],
})
export class GovernanceModule {}