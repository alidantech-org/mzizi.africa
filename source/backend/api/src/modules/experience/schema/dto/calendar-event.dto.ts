import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Calendar Event
 */
export class CalendarEventDto {
  @IsOptional()
  @ValidateIf((object) => object.actualOn !== null)
  @IsISO8601({ strict: true })
  actualOn?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.changeNote !== null)
  @IsString()
  @MaxLength(4000)
  changeNote?: Description | null;

  @IsOptional()
  @ValidateIf((object) => object.changeReason !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  changeReason?: Name | null;

  @IsInt()
  daysAway!: Integer;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  eventCode!: NonEmptyString255;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  kindCode!: NonEmptyString100;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  kindLabel!: Name;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  knowledgeCode!: NonEmptyString100;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  knowledgeLabel!: Name;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  occurrenceCode!: NonEmptyString255;

  @IsISO8601({ strict: true })
  plannedOn!: CalendarDate;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  statusCode!: NonEmptyString100;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  statusLabel!: Name;

  @IsInt()
  @Min(0)
  venueCount!: NonNegativeInteger;
}
