import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { LeaderboardMetricListDto } from "#/modules/insights/schema/dto/leaderboard-metric-list.dto";
import { leaderboardMetrics } from "#/modules/insights/features/insights/reads/leaderboards.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The query lives in `reads/leaderboards.ts`. */
@Injectable()
export class ListLeaderboardMetricsUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(): Promise<LeaderboardMetricListDto> {
    return (await leaderboardMetrics(this.db)) as unknown as LeaderboardMetricListDto;
  }
}
