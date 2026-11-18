import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { BoardInputDto } from "#/modules/insights/schema/dto/board-input.dto";
import type { LeaderboardDto } from "#/modules/insights/schema/dto/leaderboard.dto";
import { leaderboard } from "#/modules/insights/features/insights/reads/leaderboards.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The query lives in `reads/leaderboards.ts`. */
@Injectable()
export class GetLeaderboardUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: BoardInputDto): Promise<LeaderboardDto> {
    return (await leaderboard(this.db, input.metricCode, input.kindCode, input.parentFeatureId, input.limit ?? 100)) as unknown as LeaderboardDto;
  }
}
