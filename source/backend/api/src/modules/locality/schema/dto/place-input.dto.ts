import { IsISO8601, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import type { LanguageCode } from "#/modules/locality/schema/type/language-code.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Place Input
 */
export class PlaceInputDto {
  @IsString()
  @IsUUID()
  featureId!: Id;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(35)
  languageCode?: LanguageCode;

  @IsOptional()
  @IsISO8601({ strict: true })
  onDate?: CalendarDate;
}
