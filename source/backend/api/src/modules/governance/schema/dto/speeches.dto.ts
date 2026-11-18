import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One member's contribution at a sitting as recorded in the Hansard: a speech, question, answer, statement or ruling. The full text, when stored, is a content row about this speech. (entity)
 */
export class SpeechesDto {
  @IsOptional()
  @ValidateIf((object) => object.billId !== null)
  @IsString()
  @IsUUID()
  billId?: Id | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.hansardId !== null)
  @IsString()
  @IsUUID()
  hansardId?: Id | null;

  @IsString()
  @IsUUID()
  holderId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.motionId !== null)
  @IsString()
  @IsUUID()
  motionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.pageReference !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  pageReference?: NonEmptyString100 | null;

  @IsInt()
  @Min(1)
  position!: PositiveInteger;

  @IsString()
  @IsUUID()
  sittingId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

  @IsString()
  @IsUUID()
  speechKindId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.summary !== null)
  @IsString()
  @MaxLength(4000)
  summary?: Description | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;

  @IsOptional()
  @ValidateIf((object) => object.wordCount !== null)
  @IsInt()
  @Min(0)
  wordCount?: NonNegativeInteger | null;
}
