import { Module } from "@nestjs/common";
import { LegislatureLawmakingModule } from "#/modules/legislature/features/lawmaking/lawmaking.module.ts";

@Module({
  imports: [LegislatureLawmakingModule],
})
export class LegislatureModule {}
