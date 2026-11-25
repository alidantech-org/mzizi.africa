import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateIf,
} from "class-validator";

import { Checker } from "#/modules/community/schema/enum/checker.enum.ts";
import { Verdict } from "#/modules/community/schema/enum/verdict.enum.ts";
import type { Confidence } from "#/modules/shared/schema/type/confidence.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One automated or human check of a moderation case. (entity)
 */
export class ChecksDto {
  @IsString()
  @IsUUID()
  caseId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.categoryTerm !== null)
  @IsString()
  @IsUUID()
  categoryTerm?: Id | null;

  @IsISO8601({})
  checkedAt!: Instant;

  @IsEnum(Checker)
  checker!: Checker;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.score !== null)
  @IsNumber({})
  @Min(0)
  @Max(1)
  score?: Confidence | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsEnum(Verdict)
  verdict!: Verdict;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
