import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Countdown Milestone
 */
export class CountdownMilestoneDto {
  @IsInt()
  daysAway!: Integer;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsOptional()
  @ValidateIf((object) => object.offsetDays !== null)
  @IsInt()
  offsetDays?: Integer | null;

  @IsISO8601({ strict: true })
  plannedOn!: CalendarDate;
}
