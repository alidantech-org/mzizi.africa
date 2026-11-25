import { Module, type Type } from "@nestjs/common";
import { GetIndicatorUseCase } from "#/modules/statistics/features/indicators/use-cases/get-indicator.repository.ts";
import { ListIndicatorsUseCase } from "#/modules/statistics/features/indicators/use-cases/list-indicators.repository.ts";

import { StatisticsIndicatorsController } from "./indicators.controller.ts";
import {
  StatisticsIndicatorsService,
  StatisticsIndicatorsServiceImpl,
} from "./indicators.service.ts";

@Module({
  controllers: [StatisticsIndicatorsController],
  providers: [
    {
      provide: StatisticsIndicatorsService,
      useClass: StatisticsIndicatorsServiceImpl satisfies Type<StatisticsIndicatorsService>,
    },
    GetIndicatorUseCase,
    ListIndicatorsUseCase,
  ],
  exports: [StatisticsIndicatorsService],
})
export class StatisticsIndicatorsModule {}
