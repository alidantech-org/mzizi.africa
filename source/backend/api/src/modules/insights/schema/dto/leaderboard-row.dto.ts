import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * Leaderboard Row
 */
export class LeaderboardRowDto {
  @IsOptional()
  @ValidateIf((object) => object.detail !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  detail?: NonEmptyString500 | null;

  @IsOptional()
  @ValidateIf((object) => object.featureId !== null)
  @IsString()
  @IsUUID()
  featureId?: Id | null;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsInt()
  @Min(1)
  rank!: PositiveInteger;

  @IsOptional()
  @ValidateIf((object) => object.share !== null)
  @IsNumber({})
  share?: Number | null;

  @IsOptional()
  @ValidateIf((object) => object.subjectId !== null)
  @IsString()
  @IsUUID()
  subjectId?: Id | null;

  @IsNumber({})
  value!: Number;
}
