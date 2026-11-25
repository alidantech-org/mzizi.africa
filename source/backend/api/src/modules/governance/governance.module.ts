import { Module } from "@nestjs/common";
import { GovernanceBodiesModule } from "#/modules/governance/features/bodies/bodies.module.ts";
import { GovernanceSeatsModule } from "#/modules/governance/features/seats/seats.module.ts";

@Module({
  imports: [GovernanceBodiesModule, GovernanceSeatsModule],
})
export class GovernanceModule {}
