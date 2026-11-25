import { Module } from "@nestjs/common";
import { HistoryTimelineModule } from "#/modules/history/features/timeline/timeline.module.ts";

@Module({
  imports: [HistoryTimelineModule],
})
export class HistoryModule {}
