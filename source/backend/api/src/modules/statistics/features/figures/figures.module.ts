import { Module, type Type } from "@nestjs/common";
import { ListIndicatorFiguresUseCase } from "#/modules/statistics/features/figures/use-cases/list-indicator-figures.repository.ts";
import { ListObservationsUseCase } from "#/modules/statistics/features/figures/use-cases/list-observations.repository.ts";
import { ListPlaceFiguresUseCase } from "#/modules/statistics/features/figures/use-cases/list-place-figures.repository.ts";

import { StatisticsFiguresController } from "./figures.controller.ts";
import { StatisticsFiguresService, StatisticsFiguresServiceImpl } from "./figures.service.ts";

@Module({
  controllers: [StatisticsFiguresController],
  providers: [
    {
      provide: StatisticsFiguresService,
      useClass: StatisticsFiguresServiceImpl satisfies Type<StatisticsFiguresService>,
    },
    ListIndicatorFiguresUseCase,
    ListObservationsUseCase,
    ListPlaceFiguresUseCase,
  ],
  exports: [StatisticsFiguresService],
})
export class StatisticsFiguresModule {}
