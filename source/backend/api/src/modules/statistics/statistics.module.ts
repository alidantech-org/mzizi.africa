import { Module } from "@nestjs/common";
import { StatisticsFiguresModule } from "#/modules/statistics/features/figures/figures.module.ts";
import { StatisticsIndicatorsModule } from "#/modules/statistics/features/indicators/indicators.module.ts";

@Module({
  imports: [StatisticsFiguresModule, StatisticsIndicatorsModule],
})
export class StatisticsModule {}
