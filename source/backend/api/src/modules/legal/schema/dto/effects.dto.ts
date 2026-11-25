import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import { ReviewStatus } from "#/modules/legal/schema/enum/review-status.enum.ts";
import type { Note } from "#/modules/legal/schema/type/note.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * What a provision does to a named thing; a reviewed assertion that never changes the thing itself. (entity)
 */
export class EffectsDto {
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
  @ValidateIf((object) => object.effectiveOn !== null)
  @IsISO8601({ strict: true })
  @Satisfies<EffectsDto>(
    (object) =>
      object.effectiveOn == null || object.endedOn == null || object.effectiveOn <= object.endedOn,
    {
      message: "Effect Dates Are Ordered",
    },
  )
  effectiveOn?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.endedOn !== null)
  @IsISO8601({ strict: true })
  endedOn?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  fromYear?: Year | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  identityId!: Id;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.note !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  @Satisfies<EffectsDto>((object) => object.note == null || object.noteLanguageId != null, {
    message: "Effect Note Has Language",
  })
  note?: Note | null;

  @IsOptional()
  @ValidateIf((object) => object.noteLanguageId !== null)
  @IsString()
  @IsUUID()
  noteLanguageId?: Id | null;

  @IsEnum(ReviewStatus)
  reviewStatus!: ReviewStatus;

  @IsOptional()
  @ValidateIf((object) => object.toYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  toYear?: Year | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;

  @IsString()
  @IsUUID()
  wordingId!: Id;
}
