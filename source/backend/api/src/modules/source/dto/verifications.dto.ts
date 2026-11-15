
import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from "class-validator";
import { VerificationOutcome } from "#/modules/source/enum/verification-outcome.enum.ts";
import type { Confidence } from "#/modules/shared/type/confidence.type.ts";
import type { Description } from "#/modules/shared/type/description.type.ts";
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { JsonText } from "#/modules/shared/type/json-text.type.ts";
import type { PositiveInteger } from "#/modules/shared/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/type/instant.type.ts";

/**
 * Append-only attributable assessment; disagreement and insufficient evidence remain explicit outcomes. (entity)
 */
export class VerificationsDto {

  @IsISO8601({})
  assessedAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.confidence !== null)
  @IsNumber({})
  @Min(0)
  @Max(1)
  confidence?: Confidence | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  evidenceId!: Id;

  @IsString()
  @MaxLength(4000)
  explanation!: Description;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  methodId!: Id;

  @IsEnum(VerificationOutcome)
  outcome!: VerificationOutcome;

  @IsString()
  @IsJSON()
  reviewerSnapshot!: JsonText;

  @IsOptional()
  @ValidateIf((object) => object.supersedesId !== null)
  @IsString()
  @IsUUID()
  supersedesId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}