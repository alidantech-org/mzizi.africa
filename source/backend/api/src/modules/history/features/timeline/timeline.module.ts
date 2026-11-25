import { Module, type Type } from "@nestjs/common";
import { ListErasUseCase } from "#/modules/history/features/timeline/use-cases/list-eras.repository.ts";
import { ListHistoryUseCase } from "#/modules/history/features/timeline/use-cases/list-history.repository.ts";

import { HistoryTimelineController } from "./timeline.controller.ts";
import { HistoryTimelineService, HistoryTimelineServiceImpl } from "./timeline.service.ts";

@Module({
  controllers: [HistoryTimelineController],
  providers: [
    {
      provide: HistoryTimelineService,
      useClass: HistoryTimelineServiceImpl satisfies Type<HistoryTimelineService>,
    },
    ListErasUseCase,
    ListHistoryUseCase,
  ],
  exports: [HistoryTimelineService],
})
export class HistoryTimelineModule {}
