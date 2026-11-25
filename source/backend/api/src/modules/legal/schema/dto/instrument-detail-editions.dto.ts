import { IsISO8601, IsString, IsUUID, MaxLength, MinLength, ValidateIf } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Instrument Detail Editions
 */
export class InstrumentDetailEditionsDto {
  @ValidateIf((object) => object.commencedOn !== null)
  @IsISO8601({ strict: true })
  commencedOn!: CalendarDate | null;

  @ValidateIf((object) => object.consolidatedOn !== null)
  @IsISO8601({ strict: true })
  consolidatedOn!: CalendarDate | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  designation!: NonEmptyString255;

  @IsString()
  @IsUUID()
  editionId!: Id;
}
