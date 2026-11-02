import { Module } from "@nestjs/common";
import { GovernanceGovernanceReadModule } from "#/modules/governance/governance-read/governance-read.module.ts";

@Module({
  imports: [
    GovernanceGovernanceReadModule,
  ],
})
export class GovernanceModule {}