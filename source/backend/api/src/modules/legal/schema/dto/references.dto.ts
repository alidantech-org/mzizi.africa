import {
  IsEnum,
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

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import { ReferenceMethod } from "#/modules/legal/schema/enum/reference-method.enum.ts";
import { ReferenceRelation } from "#/modules/legal/schema/enum/reference-relation.enum.ts";
import { ReviewStatus } from "#/modules/legal/schema/enum/review-status.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A textual mention of a provision inside a wording or translation, with the exact span. A mention is not an amendment. (entity)
 *
 * Invariant "ExactlyOneOrigin" has no simple form, so it isn't validated here.
 */
export class ReferencesDto {
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

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(ReferenceMethod)
  method!: ReferenceMethod;

  @IsEnum(ReferenceRelation)
  relation!: ReferenceRelation;

  @IsEnum(ReviewStatus)
  reviewStatus!: ReviewStatus;

  @IsInt()
  @Min(1)
  spanEnd!: PositiveInteger;

  @IsInt()
  @Min(0)
  @Satisfies<ReferencesDto>(
    (object) =>
      object.spanStart == null || object.spanEnd == null || object.spanStart < object.spanEnd,
    {
      message: "Span Must Be Ordered",
    },
  )
  @Satisfies<ReferencesDto>((object) => object.spanStart !== object.spanEnd, {
    message: "Span Must Be Non Empty",
  })
  spanStart!: NonNegativeInteger;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  spanText!: NonEmptyString500;

  @IsString()
  @IsUUID()
  targetProvisionId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.targetWordingId !== null)
  @IsString()
  @IsUUID()
  targetWordingId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.translationId !== null)
  @IsString()
  @IsUUID()
  translationId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;

  @IsOptional()
  @ValidateIf((object) => object.wordingId !== null)
  @IsString()
  @IsUUID()
  wordingId?: Id | null;
}
