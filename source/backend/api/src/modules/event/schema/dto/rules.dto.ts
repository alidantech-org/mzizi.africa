import {
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

import type { Day } from "#/modules/event/schema/type/day.type.ts";
import type { Month } from "#/modules/event/schema/type/month.type.ts";
import type { Nth } from "#/modules/event/schema/type/nth.type.ts";
import type { Weekday } from "#/modules/event/schema/type/weekday.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * When an event recurs. (entity)
 */
export class RulesDto {
  @IsOptional()
  @ValidateIf((object) => object.adjustmentTerm !== null)
  @IsString()
  @IsUUID()
  adjustmentTerm?: Id | null;

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
  @Max(31)
  dayOfMonth?: Day | null;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  eventId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  fromYear?: Year | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.intervalYears !== null)
  @IsInt()
  @Min(1)
  intervalYears?: PositiveInteger | null;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.month !== null)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: Month | null;

  @IsOptional()
  @ValidateIf((object) => object.nthWeekday !== null)
  @IsInt()
  @Min(-5)
  @Max(5)
  nthWeekday?: Nth | null;

  @IsOptional()
  @ValidateIf((object) => object.rrule !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  rrule?: NonEmptyString500 | null;

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
  @Max(7)
  weekday?: Weekday | null;
}
