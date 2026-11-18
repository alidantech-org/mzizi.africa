import { IsISO8601, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import type { Code } from "#/modules/experience/schema/type/code.type.ts";
import type { Language } from "#/modules/experience/schema/type/language.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Calendar Input
 */
export class CalendarInputDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  featureId?: Id;

  @IsOptional()
  @IsISO8601({ strict: true })
  from?: CalendarDate;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  kindCode?: Code;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(35)
  languageCode?: Language;

  @IsOptional()
  @IsISO8601({ strict: true })
  to?: CalendarDate;
}
