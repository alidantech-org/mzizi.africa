import { Module } from "@nestjs/common";
import { CommunityContributionsModule } from "#/modules/community/features/contributions/contributions.module.ts";
import { CommunityCountingModule } from "#/modules/community/features/counting/counting.module.ts";

@Module({
  imports: [CommunityContributionsModule, CommunityCountingModule],
})
export class CommunityModule {}
