import { IsBoolean, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";
import type { Code } from "#/modules/insights/schema/type/code.type.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";

/**
 * Leaderboard Metric
 */
export class LeaderboardMetricDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  code!: Code;

  @IsString()
  @MaxLength(4000)
  describe!: Description;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  domain!: NonEmptyString100;

  @IsBoolean()
  higherIsBetter!: Flag;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  title!: Name;

  @IsOptional()
  @ValidateIf((object) => object.unit !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  unit?: NonEmptyString100 | null;
}
