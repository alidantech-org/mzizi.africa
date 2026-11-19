import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { Code } from "#/modules/insights/schema/type/code.type.ts";
import type { Count } from "#/modules/insights/schema/type/count.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Law Instrument
 */
export class LawInstrumentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  code!: Code;

  @IsOptional()
  @ValidateIf((object) => object.enactedOn !== null)
  @IsISO8601({ strict: true })
  enactedOn?: CalendarDate | null;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  kindCode!: Code;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  kindLabel!: NonEmptyString500;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  name!: NonEmptyString500;

  @IsInt()
  @Min(0)
  @Max(100000000)
  provisions!: Count;
}
