import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { LeaderboardMetricDto } from "#/modules/insights/schema/dto/leaderboard-metric.dto.ts";
import { LeaderboardRowDto } from "#/modules/insights/schema/dto/leaderboard-row.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Leaderboard
 */
export class LeaderboardDto {
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsDefined()
  @ValidateNested()
  @Type(() => LeaderboardMetricDto)
  metric!: LeaderboardMetricDto;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => LeaderboardRowDto)
  rows!: LeaderboardRowDto[];

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  scope!: NonEmptyString500;
}
