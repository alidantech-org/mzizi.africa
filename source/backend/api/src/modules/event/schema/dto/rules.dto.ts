import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * How the dates of an event are produced, with the adjustment the law applies when a date falls on a rest day. Occurrences generated from a rule are projected until announced. (entity)
 */
export class RulesDto {
  @IsOptional()
  @ValidateIf((object) => object.adjustmentId !== null)
  @IsString()
  @IsUUID()
  adjustmentId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.anchorOn !== null)
  @IsISO8601({ strict: true })
  anchorOn?: CalendarDate | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.dayOfMonth !== null)
  @IsInt()
  @Min(1)
  dayOfMonth?: PositiveInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  eventId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.fromToPrecision !== null)
  @IsEnum(DatePrecision)
  fromToPrecision?: DatePrecision | null;

  @IsOptional()
  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  @Satisfies<RulesDto>(
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

  @IsOptional()
  @ValidateIf((object) => object.intervalYears !== null)
  @IsInt()
  @Min(1)
  intervalYears?: PositiveInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.month !== null)
  @IsInt()
  @Min(1)
  month?: PositiveInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.nthWeekday !== null)
  @IsInt()
  @Min(1)
  nthWeekday?: PositiveInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.rrule !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  rrule?: NonEmptyString500 | null;

  @IsString()
  @IsUUID()
  ruleKindId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

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

  @IsOptional()
  @ValidateIf((object) => object.weekday !== null)
  @IsInt()
  @Min(1)
  weekday?: PositiveInteger | null;
}
