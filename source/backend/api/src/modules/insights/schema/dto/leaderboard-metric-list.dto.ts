import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { LeaderboardMetricDto } from "#/modules/insights/schema/dto/leaderboard-metric.dto.ts";

/**
 * Leaderboard Metric List
 */
export class LeaderboardMetricListDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => LeaderboardMetricDto)
  metrics!: LeaderboardMetricDto[];
}
