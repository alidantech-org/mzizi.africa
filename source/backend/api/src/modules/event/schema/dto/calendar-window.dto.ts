import { IsInt, IsISO8601, IsOptional, IsString, IsUUID } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Calendar Window
 */
export class CalendarWindowDto {
  @IsString()
  @IsUUID()
  countryId!: Id;

  @IsISO8601({ strict: true })
  from!: CalendarDate;

  @IsOptional()
  @IsInt()
  limit?: Integer;

  @IsOptional()
  @IsInt()
  offset?: Integer;
}
