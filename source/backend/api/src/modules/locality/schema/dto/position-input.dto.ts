import {
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import type { LanguageCode } from "#/modules/locality/schema/type/language-code.type.ts";
import type { Latitude } from "#/modules/locality/schema/type/latitude.type.ts";
import type { Longitude } from "#/modules/locality/schema/type/longitude.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Position Input
 */
export class PositionInputDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(35)
  languageCode?: LanguageCode;

  @IsNumber({})
  @Min(-90)
  @Max(90)
  latitude!: Latitude;

  @IsNumber({})
  @Min(-180)
  @Max(180)
  longitude!: Longitude;

  @IsOptional()
  @IsISO8601({ strict: true })
  onDate?: CalendarDate;
}
