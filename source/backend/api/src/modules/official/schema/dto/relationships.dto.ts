import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsNumber,
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
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Confidence } from "#/modules/shared/schema/type/confidence.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Percentage } from "#/modules/shared/schema/type/percentage.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One directed typed relationship between exactly two Official identities, optionally with an ownership share. (entity)
 *
 * Invariant "HasExactlyOneFromIdentity" has no simple form, so it isn't validated here.
 *
 * Invariant "HasExactlyOneToIdentity" has no simple form, so it isn't validated here.
 */
export class RelationshipsDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

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

  @IsOptional()
  @ValidateIf((object) => object.endsOn !== null)
  @IsISO8601({ strict: true })
  endsOn?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.evidenceBasisId !== null)
  @IsString()
  @IsUUID()
  evidenceBasisId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.evidenceStatusId !== null)
  @IsString()
  @IsUUID()
  evidenceStatusId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.fromEntityId !== null)
  @IsString()
  @IsUUID()
  @Satisfies<RelationshipsDto>(
    (object) =>
      object.fromEntityId !== object.toEntityId &&
      object.fromIndividualId !== object.toIndividualId,
    {
      message: "Does Not Link Identity To Itself",
    },
  )
  fromEntityId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.fromIndividualId !== null)
  @IsString()
  @IsUUID()
  fromIndividualId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.fromToPrecision !== null)
  @IsEnum(DatePrecision)
  fromToPrecision?: DatePrecision | null;

  @IsOptional()
  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  @Satisfies<RelationshipsDto>(
    (object) =>
      object.fromYear == null || object.toYear == null || object.fromYear <= object.toYear,
    {
      message: "Period Years Are Ordered",
    },
  )
  fromYear?: Year | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  kindId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.sharePercentage !== null)
  @IsNumber({})
  @Min(0)
  @Max(100)
  sharePercentage?: Percentage | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.startsOn !== null)
  @IsISO8601({ strict: true })
  @Satisfies<RelationshipsDto>(
    (object) =>
      object.startsOn == null || object.endsOn == null || object.startsOn <= object.endsOn,
    {
      message: "Relationships Dates Are Ordered",
    },
  )
  startsOn?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.toEntityId !== null)
  @IsString()
  @IsUUID()
  toEntityId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.toIndividualId !== null)
  @IsString()
  @IsUUID()
  toIndividualId?: Id | null;

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
}
