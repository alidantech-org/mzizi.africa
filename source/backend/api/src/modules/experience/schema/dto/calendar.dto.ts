import { Type } from "class-transformer";
import {
  IsArray,
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { CalendarEventDto } from "#/modules/experience/schema/dto/calendar-event.dto.ts";
import { CountdownDto } from "#/modules/experience/schema/dto/countdown.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Calendar
 */
export class CalendarDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CalendarEventDto)
  events!: CalendarEventDto[];

  @IsISO8601({ strict: true })
  from!: CalendarDate;

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsOptional()
  @ValidateIf((object) => object.next !== null)
  @ValidateNested()
  @Type(() => CountdownDto)
  next?: CountdownDto | null;

  @IsISO8601({ strict: true })
  to!: CalendarDate;
}
