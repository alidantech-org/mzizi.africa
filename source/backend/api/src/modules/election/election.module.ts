import { Module } from "@nestjs/common";
import { ElectionContestsModule } from "#/modules/election/features/contests/contests.module.ts";

@Module({
  imports: [ElectionContestsModule],
})
export class ElectionModule {}
