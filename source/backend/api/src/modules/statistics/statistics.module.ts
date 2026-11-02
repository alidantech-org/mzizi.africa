import { Module } from "@nestjs/common";
import { StatisticsStatisticsReadModule } from "#/modules/statistics/statistics-read/statistics-read.module.ts";

@Module({
  imports: [
    StatisticsStatisticsReadModule,
  ],
})
export class StatisticsModule {}